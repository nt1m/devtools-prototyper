const {utils: Cu} = Components;
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

const require = () => {};

let LocalizationHelper = require(`${basePath}/content/lib/l10n`);
let L10N = new LocalizationHelper(`${basePath}/locale/strings.properties`);
const tabs = require("sdk/tabs");
let Services = {};
