/* exported startup, shutdown, install, uninstall */
/* global toolDefinition */

"use strict";

const basePath = "chrome://devtools-prototyper";
const Cu = Components.utils;
let {require, lazyGetter} =
  Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools;

let Services = require("Services");

let {gDevTools} =
  Cu.import("resource://devtools/client/framework/gDevTools.jsm", {});

// Can't use l10n.js because FF loads manifest after bootstrap file :(
let L10N = Services.strings.createBundle(`${basePath}/locale/strings.properties?${Date.now()}`);

function getToolDefinition() {
  return {
    id: "prototyper",
    icon: `${basePath}/skin/images/icon.svg`,
    invertIconForLightTheme: true,
    url: `${basePath}/content/panel.html`,
    label: L10N.GetStringFromName("prototyper.label"),
    tooltip: L10N.GetStringFromName("prototyper.tooltip"),

    isTargetSupported: function(target) {
      return target.isLocalTab;
    },

    build: function(iframeWindow, toolbox) {
      let {PrototyperPanel} = require(`${basePath}/content/panel.js`);
      return new PrototyperPanel(iframeWindow, toolbox);
    }
  }
}

function startup() {
  gDevTools.registerTool(getToolDefinition());
}

function shutdown() {
  gDevTools.unregisterTool(getToolDefinition());
  Services.obs.notifyObservers(null, "startupcache-invalidate", null);
}

function install() {}

function uninstall() {}
