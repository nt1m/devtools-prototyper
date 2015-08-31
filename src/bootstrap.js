"use strict";

const basePath = "chrome://devtools-prototyper";

const {utils: Cu} = Components;
const {require, loader} =
      Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const Services = require("Services");
const {gDevTools} = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});
const {ViewHelpers} = require("resource:///modules/devtools/ViewHelpers.jsm");
const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);

loader.lazyGetter(this, "toolDefinition", () => ({
  id: "prototyper",
  icon: `${basePath}/skin/images/icon.svg`,
  invertIconForLightTheme: true,
  url: `${basePath}/content/panel.html`,
  label: L10N.getStr("prototyper.label"),
  tooltip: L10N.getStr("prototyper.tooltip"),

  isTargetSupported: function(target) {
    return target.isLocalTab;
  },

  build: function(iframeWindow, toolbox) {
    let {PrototyperPanel} = require(`${basePath}/content/panel.js`);
    return new PrototyperPanel(iframeWindow, toolbox);
  }
}));

function startup() {
  gDevTools.registerTool(toolDefinition);
}

function shutdown() {
  gDevTools.unregisterTool(toolDefinition);
  Services.obs.notifyObservers(null, "startupcache-invalidate", null);
}

function install() {}

function uninstall() {}
