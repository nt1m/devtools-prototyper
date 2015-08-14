const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
const {ViewHelpers} = Cu.import("resource:///modules/devtools/ViewHelpers.jsm", {});
const require = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";
// XXX : Move all strings from strings.dtd to strings.properties
const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);
const tabs = require("sdk/tabs");

const Events = {
	LIBRARY_CHANGE: "Prototyper::LibraryChange",
	CODE_RUN: "Prototyper::CodeRun",
	SETTINGS_CHANGE: "Prototyper::SettingsChange"
}
