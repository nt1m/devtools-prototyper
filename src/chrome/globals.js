//const {utils: Cu} = Components;

const Cu = {};
const basePath = "chrome://devtools-prototyper";
const prototypeName = "prototype.html";

const require = () => {};

let L10N = {
  getStr: (str) => {
    let camelCase = (key) => key.split(/[\.|\-]/g).filter(v => v !== "prototyper").map((v, i) => v[0][i == 0 ? "toLowerCase" : "toUpperCase"]() + v.substring(1)).join("");
    console.log(camelCase(str));
    return browser.i18n.getMessage(camelCase(str));
  },
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
