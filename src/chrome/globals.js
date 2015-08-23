const {utils: Cu} = Components;

const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

const {require} = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const {ViewHelpers} = require("resource:///modules/devtools/ViewHelpers.jsm");
const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);
const tabs = require("sdk/tabs");

const Events = {
	LIBRARY_CHANGE: "Prototyper::LibraryChange",
	CODE_RUN: "Prototyper::CodeRun",
	SETTINGS_CHANGE: "Prototyper::SettingsChange"
};
