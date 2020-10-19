"use strict";

chrome.devtools.panels.create(
  "Prototyper",
  "skin/images/icon.svg",
  "ui/panel.html",
  function (panel) {
    console.log(panel)
  }
);
