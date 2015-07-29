const {Cu} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;

exports.Storage = {
  get: function(pref) {
    let prefname = prefPrefix + pref;
    if (!Services.prefs.getPrefType(prefname)) {
      Services.prefs.setCharPref(prefname, "");
      this.enablePrefSync(pref);
    }
    return Services.prefs.getCharPref(prefname);
  },
  set: function(pref, value) {
    Services.prefs.setCharPref(prefPrefix + pref, value);
  },
  enablePrefSync: function(pref) {
    Services.prefs.setBoolPref(syncPrefPrefix + pref, true);
  }
};
