//const {utils: Cu} = Components;

const Cu = {};
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

const require = () => {};

let L10N = {
  getStr: (str) => str,
};
const tabs = require("sdk/tabs");
let Services = {
  prefs: {
    getPrefType: () => "",
    getChildList: () => [],
    setCharPref: () => {},
    getCharPref: () => "",
    setBoolPref: () => {},
  }
};
