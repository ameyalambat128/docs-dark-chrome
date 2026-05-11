// Docs Dark 2.0 - Enhanced content script based on darkdocs ideal sample

/////////////
// LOGGING //
/////////////

class log {
  static debug(...args) {
    return;
    console.log('[DEBUG]', ...args);
  }
  static info(...args) {
    console.log('[INFO]', ...args);
  }
  static warn(...args) {
    console.log('\x1b[33m%s\x1b[0m', '[WARN]', ...args);
  }
  static error(...args) {
    console.log('\x1b[31m%s\x1b[0m', '[ERROR]', ...args);
  }
}

///////////////
// NAMESPACE //
///////////////

var browser_namespace;

// PREFER BROWSER NAMESPACE OVER CHROME
if (typeof browser != 'undefined') {
  log.debug('"BROWSER" NAMESPACE FOUND');
  browser_namespace = browser;
} else if (typeof chrome != 'undefined') {
  log.debug('"CHROME" NAMESPACE FOUND');
  browser_namespace = chrome;
} else {
  throw new Error('COULD NOT FIND BROWSER NAMESPACE');
}

///////////////////////
// UTILITY FUNCTIONS //
///////////////////////

function update_storage(storage_object, key, value) {
  browser_namespace.storage.sync.get(storage_object, function (data) {
    if (data[storage_object] != null) data[storage_object][key] = value;
    else data[storage_object] = { [key]: value };

    browser_namespace.storage.sync.set({
      [storage_object]: data[storage_object],
    });
  });
}

function set_storage(storage_object, value) {
  browser_namespace.storage.sync.set({ [storage_object]: value });
}

///////////////////////////
// END UTILITY FUNCTIONS //
///////////////////////////

const head =
  document.head ||
  document.getElementsByTagName('head')[0] ||
  document.documentElement;
const version = browser_namespace.runtime.getManifest().version;

const mode_off = 0;
const mode_light = 1;
const mode_dark = 2;

const dark_mode_normal = 0;
const dark_mode_eclipse = 1;

const default_accent_hue = 88; // GREEN
const default_background = 'dark';
const default_dark_mode = { variant: dark_mode_normal };

const css_path = 'css/';

var mode;
var dark_mode_options;
var accent_color;

// DO NOT ENABLE DARK MODE ON GOOGLE DOCS HOMEPAGE
if (document.querySelector('.docs-homescreen-gb-container'))
  throw new Error('NOT ENABLING DOCS DARK ON GOOGLE DOCS HOMEPAGE');

let cssId = 'darkThemeStyleSheet';

function inject_css_file(file) {
  let file_id = 'docsdark_' + file.replace('.', '_');

  if (document.querySelector('#' + file_id)) return;

  const css = document.createElement('link');
  css.setAttribute('href', browser_namespace.runtime.getURL(css_path + file));
  css.id = file_id;
  css.rel = 'stylesheet';

  head.appendChild(css);
}

function remove_css_file(file) {
  let file_id = 'docsdark_' + file.replace('.', '_');

  if (document.querySelector('#' + file_id))
    document.querySelector('#' + file_id).remove();
}

function inject_dark_mode(dark_mode) {
  mode = mode_dark;

  inject_css_file('dark_theme.css'); // BASE DARK MODE

  log.info('Dark mode enabled!');
}

function remove_css_files() {
  remove_css_file('dark_theme.css');
}

function remove_dark_mode() {
  mode = mode_off;
  remove_css_files();

  if (document.querySelector('#' + cssId)) {
    let linkToCSS = document.getElementById(cssId);
    linkToCSS.parentElement.removeChild(linkToCSS);
  }
}

function handle_mode() {
  if (mode == null) {
    // FIRST INVOCATION; ENABLE DEFAULT DARK MODE BY DEFAULT
    inject_dark_mode(default_dark_mode);
    set_storage('mode', mode_dark);
  } else if (mode == mode_dark) {
    inject_dark_mode(dark_mode_options);
  } else {
    // TURN OFF DARK MODE
    remove_dark_mode();
  }
}

function update_accent_color(color) {
  accent_color = color;
  document.documentElement.style.setProperty(
    '--darkdocs-accent-hue',
    color.hue
  );
}

function remove_accent_color() {
  document.documentElement.style.removeProperty('--darkdocs-accent-hue');
}

/////////////////
// ENTRY POINT //
/////////////////

browser_namespace.storage.sync.get(
  [
    'mode',
    'dark_mode',
    'accent_color',
    'GDDM-active', // Legacy support
  ],
  function (data) {
    //////////
    // MODE //
    //////////

    // Check legacy setting first
    if (data['GDDM-active'] === 'false') {
      mode = mode_off;
      set_storage('mode', mode_off);
    } else if (data.mode != null) {
      mode = data.mode;
    } else {
      // SET DEFAULT MODE
      mode = mode_dark;
      set_storage('mode', mode);
    }

    ///////////////////
    // MODE VARIANTS //
    ///////////////////

    if (data.dark_mode != null) {
      dark_mode_options = data.dark_mode;
    } else {
      // SET DEFAULT DARK MODE OPTIONS
      dark_mode_options = { variant: dark_mode_normal };
      set_storage('dark_mode', dark_mode_options);
    }

    //////////////////
    // ACCENT COLOR //
    //////////////////

    if (data.accent_color != null) {
      log.debug('FOUND SAVED ACCENT COLOR');
      accent_color = data.accent_color;
      update_accent_color(data.accent_color);
    } else {
      log.debug('NO SAVED ACCENT COLOR FOUND');
      // SET DEFAULT ACCENT COLOR
      accent_color = { hue: default_accent_hue };
      update_accent_color(accent_color);

      // SAVE DEFAULT ACCENT COLOR
      update_storage('accent_color', 'hue', default_accent_hue);
    }

    log.debug('ACCENT COLOR:', accent_color);

    /////////////////////
    // INVOKE HANDLERS //
    /////////////////////

    handle_mode();
  }
);

////////////////////////////
// HANDLE STORAGE CHANGES //
////////////////////////////

browser_namespace.storage.onChanged.addListener(function (changes, area) {
  //////////
  // MODE //
  //////////

  if (changes.mode != null) {
    mode = changes.mode.newValue;
    handle_mode();
  }

  ///////////////////////
  // DARK MODE VARIANT //
  ///////////////////////

  if (changes.dark_mode != null) {
    dark_mode_options = changes.dark_mode.newValue;
    if (mode == mode_dark) {
      handle_mode();
    }
  }

  //////////////////
  // ACCENT COLOR //
  //////////////////

  if (changes.accent_color != null) {
    accent_color = changes.accent_color.newValue;
    update_accent_color(accent_color);
  }

  // Legacy support
  if (changes['GDDM-active'] != null) {
    if (changes['GDDM-active'].newValue === 'false') {
      mode = mode_off;
      handle_mode();
    } else {
      mode = mode_dark;
      handle_mode();
    }
  }
});

// LISTEN FOR MESSAGES FROM POPUP (Legacy support)
browser_namespace.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    if (message === 'true') {
      mode = mode_dark;
      handle_mode();
    } else if (message === 'false') {
      mode = mode_off;
      handle_mode();
    } else if (message.type == 'setAccentColor') {
      update_accent_color(message.color);
    }
  }
);
