"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
const {ViewHelpers} = Cu.import("resource:///modules/devtools/ViewHelpers.jsm", {});
const require = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const basePath = "chrome://devtools-prototyper";
// XXX : Move all strings from strings.dtd to strings.properties
const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);

const app = require(`${basePath}/content/components/all.js`);
console.log(app);

React.renderComponent(app, document.body);

// const Events = {
// 	LIBRARY_CHANGE: "Prototyper::LibraryChange",
// 	CODE_RUN: "Prototyper::CodeRun",
// 	SETTINGS_CHANGE: "Prototyper::SettingsChange"
// }
// let IconList = [
// 	{
// 		id: "",
// 		tooltip: L10N("foo"),
// 		icon: "",
// 		toggle: "",
// 		onClick: () => {}
// 	}
// ];
