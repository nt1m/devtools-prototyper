const {utils: Cu} = Components;
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

let {require, lazyGetter} =
  Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools;
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
const tabs = require("sdk/tabs");
let Services;
try {
  Services = require("Services");
} catch(e) {
  // Do nothing
}
