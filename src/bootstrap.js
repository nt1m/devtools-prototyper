"use strict";

const basePath = "chrome://devtools-prototyper";

const {utils: Cu} = Components;
let {require, lazyGetter} =
  Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools;
let {gDevTools} =
  Cu.import("resource://devtools/client/framework/gDevTools.jsm", {});
let L10N;
try {
  // Firefox 48+
  let { LocalizationHelper } = require("devtools/client/shared/l10n");
  L10N = new LocalizationHelper(`${basePath}/locale/strings.properties`);
} catch(e) {
  // Firefox 44 to 47
  let {ViewHelpers} =
    require("resource://devtools/client/shared/widgets/ViewHelpers.jsm");
  L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);
}

const Services = require("Services");

lazyGetter(this, "toolDefinition", () => ({
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
