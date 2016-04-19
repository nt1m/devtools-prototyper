"use strict";

const basePath = "chrome://devtools-prototyper";

const {utils: Cu} = Components;
let require, lazyGetter, gDevTools, L10N;
try {
  ({require, lazyGetter} =
 Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools);
  ({gDevTools} =
 Cu.import("resource://devtools/client/framework/gDevTools.jsm", {}));
  let { LocalizationHelper } = require("devtools/client/shared/l10n");
  L10N = new LocalizationHelper(`${basePath}/locale/strings.properties`);
} catch(e) {
  // Fallback to old paths
  ({require, lazyGetter} =
    Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools);
  ({gDevTools} =
    Cu.import("resource:///modules/devtools/gDevTools.jsm", {}));
  let {ViewHelpers} =
    require("resource:///modules/devtools/ViewHelpers.jsm");
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
