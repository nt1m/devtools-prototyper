const {utils: Cu} = Components;
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

let {require, lazyGetter} =
  Cu.import("resource://devtools/shared/Loader.jsm", {}).devtools;
let LocalizationHelper = require(`${basePath}/content/lib/l10n`);
let L10N = new LocalizationHelper(`${basePath}/locale/strings.properties`);
const tabs = require("sdk/tabs");
let Services;
try {
  Services = require("Services");
} catch(e) {
  // Do nothing
}
