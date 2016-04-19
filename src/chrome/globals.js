const {utils: Cu} = Components;
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

let require, ViewHelpers, LocalizationHelper, L10N;
try {
  ({require} =
  Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools);
  ({ LocalizationHelper } = require("devtools/client/shared/l10n"));
  L10N = new LocalizationHelper(`${basePath}/locale/strings.properties`);
} catch(e) {
  // Fallback to old paths
  ({require} =
    Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools);
  ({ViewHelpers} =
    require("resource:///modules/devtools/ViewHelpers.jsm"));
  L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);
}
const tabs = require("sdk/tabs");
let Services;
try {
  Services = require("Services");
} catch(e) {
  // Do nothing
}
