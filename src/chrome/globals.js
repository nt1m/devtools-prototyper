const {utils: Cu} = Components;
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

let require, ViewHelpers;
try {
  ({require} =
  Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {}).devtools);
  ({ViewHelpers} =
require("resource:///modules/devtools/client/shared/widgets/ViewHelpers.jsm"));
} catch(e) {
  // Fallback to old paths
  ({require} =
    Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools);
  ({ViewHelpers} =
    require("resource:///modules/devtools/ViewHelpers.jsm"));
}
const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);
const tabs = require("sdk/tabs");
let Services;
try {
  Services = require("Services");
} catch(e) {
  // Do nothing
}
