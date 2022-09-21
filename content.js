var cssId = "darkModeStylesheet";
try {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.id = cssId;
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = chrome.runtime.getURL("css/dark_theme.css");
  link.media = "all";
  head.appendChild(link);
  console.log("Dark mode enabled successfully!");
} catch (err) {
  console.log("Error while loading dark mode: ", err);
}

chrome.storage.sync.get(["GDDM-active"], function (result) {
  if (result["GDDM-active"] === "false") {
    if (document.getElementById(cssId)) {
      let linkToCSS = document.getElementById(cssId);
      linkToCSS.parentElement.removeChild(linkToCSS);
    }
  }
});
chrome.runtime.onMessage.addListener(function (message) {
  if (message === "true") {
    // If link is not there, add it
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = chrome.runtime.getURL("css/dark_theme.css");
      link.media = "all";
      head.appendChild(link);
    }
  } else {
    // If the link is there, remove it
    if (document.getElementById(cssId)) {
      let linkToCSS = document.getElementById(cssId);
      linkToCSS.parentElement.removeChild(linkToCSS);
    }
  }
});
