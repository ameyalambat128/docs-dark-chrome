// darkdocs-style content script
// Based on the exact approach from https://github.com/waymondrang/darkdocs

/////////////
// LOGGING //
/////////////

class log {
  static debug(...args) {
    // Debug logging disabled - uncomment the line below to enable
    // console.log('[DEBUG]', ...args);
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

/**
 * UPDATES A STORAGE OBJECT WITH A NEW KEY-VALUE PAIR
 *
 * @param {String} storage_object
 * @param {String} key
 * @param {*} value
 */
function update_storage(storage_object, key, value) {
  browser_namespace.storage.local.get(storage_object, function (data) {
    if (data[storage_object] != null) data[storage_object][key] = value;
    else data[storage_object] = { [key]: value };

    browser_namespace.storage.local.set({
      [storage_object]: data[storage_object],
    });
  });
}

/////////////
// GLOBALS //
/////////////

const css_path = 'assets/css/';
const replacement_url = (filename) =>
  `url(${browser_namespace.runtime.getURL(`assets/replacements/${filename}`)})`;
const fixed_theme_properties = {
  '--checkmark': replacement_url('checkmark.secondary.png'),
  '--darkdocs_checkmark': replacement_url('checkmark.secondary.png'),
  '--darkdocs_revisions_sprite1': replacement_url(
    'revisions_sprite1.secondary.svg'
  ),
  '--darkdocs_close_18px': replacement_url('close_18px.svg'),
  '--darkdocs_lens': replacement_url('lens.svg'),
  '--darkdocs_jfk_sprite186': replacement_url('jfk_sprite186.edited.png'),
  '--darkdocs_dimension_highlighted': replacement_url(
    'dimension-highlighted.edited.png'
  ),
  '--darkdocs_dimension_unhighlighted': replacement_url(
    'dimension-unhighlighted.edited.png'
  ),
  '--darkdocs_access_denied': replacement_url('access_denied_transparent.png'),
  '--darkdocs_access_denied_600': replacement_url(
    'access_denied_600_transparent.png'
  ),
  '--darkdocs_gm_add_black_24dp': replacement_url('gm_add_black_24dp.png'),
  '--darkdocs_accentHue': '217',
  '--darkdocs_documentBackground': '#ffffff',
  '--darkdocs_documentInvert': 'none',
  '--darkdocs_documentBorder': '1px solid var(--primary-border-color)',
  '--darkdocs-accent-hue': '217',
  '--darkdocs_document_background': '#ffffff',
  '--darkdocs_document_invert': 'none',
  '--darkdocs_document_border': '1px solid var(--primary-border-color)',
};
const theme_classes = ['darkdocs_enabled', 'darkdocs_dark', 'darkdocs_normal'];

// MODE CONSTANTS
const mode_off = 0;
const mode_dark = 1;
const mode_light = 2;

var mode;
var dark_mode_options;
var toggle_state = false;

// DO NOT ENABLE ON GOOGLE DOCS HOMEPAGE
if (document.querySelector('.docs-homescreen-gb-container'))
  throw new Error('NOT ENABLING DOCS DARK ON GOOGLE DOCS HOMEPAGE');

//////////////////////
// CSS INJECTION    //
//////////////////////

function inject_css_file(file) {
  let file_id = 'docsdark_' + file.replace('.', '_');

  if (document.querySelector('#' + file_id)) return;

  const css = document.createElement('link');
  css.setAttribute('href', browser_namespace.runtime.getURL(css_path + file));
  css.id = file_id;
  css.rel = 'stylesheet';

  document.body.insertBefore(css, document.body.lastChild);
}

function remove_css_file(file) {
  let file_id = 'docsdark_' + file.replace('.', '_');

  if (document.querySelector('#' + file_id))
    document.querySelector('#' + file_id).remove();
}

function set_fixed_theme_options() {
  Object.entries(fixed_theme_properties).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
}

function remove_fixed_theme_options() {
  Object.keys(fixed_theme_properties).forEach((property) => {
    document.documentElement.style.removeProperty(property);
  });
}

function add_theme_classes() {
  document.documentElement.classList.add(...theme_classes);
}

function remove_theme_classes() {
  document.documentElement.classList.remove(...theme_classes);
}

/**
 * INJECTS DARK MODE CSS
 */
function inject_dark_mode() {
  mode = mode_dark;

  remove_css_file('light.css');
  remove_css_file('dark_normal.css');
  set_fixed_theme_options();
  add_theme_classes();

  inject_css_file('docs.css');

  log.info('Dark mode enabled!');
}

/**
 * INJECTS LIGHT MODE CSS (DISABLED FOR NOW)
 */
function inject_light_mode() {
  mode = mode_light;

  remove_css_file('dark_normal.css');

  inject_css_file('docs.css');
  inject_css_file('light.css');

  log.info('Light mode enabled!');
}

function remove_css_files() {
  remove_css_file('docs.css');
  remove_css_file('dark_normal.css');
  remove_css_file('light.css');
}

function remove_dark_mode() {
  mode = mode_off;
  remove_css_files();
  remove_fixed_theme_options();
  remove_theme_classes();

  log.info('Dark mode disabled!');
}

//////////////////////
// STORAGE HANDLING //
//////////////////////

function load_from_storage() {
  browser_namespace.storage.local.get(['dark_mode_enabled'], function (result) {
    if (result.dark_mode_enabled !== false) {
      // Default to enabled
      inject_dark_mode();
      toggle_state = true;
    } else {
      remove_dark_mode();
      toggle_state = false;
    }
  });
}

function save_to_storage() {
  browser_namespace.storage.local.set({
    dark_mode_enabled: toggle_state,
  });
}

//////////////////////
// MESSAGE HANDLING //
//////////////////////

browser_namespace.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'toggle_dark_mode') {
      toggle_state = !toggle_state;

      if (toggle_state) {
        inject_dark_mode();
      } else {
        remove_dark_mode();
      }

      save_to_storage();
      sendResponse({ success: true, enabled: toggle_state });
    }

    if (request.action === 'get_status') {
      sendResponse({ enabled: toggle_state });
    }
  }
);

//////////////////////
// INITIALIZATION   //
//////////////////////

// Load settings and apply dark mode
load_from_storage();

log.info('Dark Docs 2.0 content script loaded');
