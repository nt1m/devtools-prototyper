/* exported startup, shutdown, install, uninstall */
/* global toolDefinition */

"use strict";

chrome.devtools.panels.create(
  "Prototyper",
  "skin/images/icon.svg",
  "chrome/panel.html",
  function (panel) {

  }
);