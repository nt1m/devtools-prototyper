Cu.import("resource://gre/modules/Services.jsm");

const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;

let Storage = {
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

if (!Storage.get("initialized")) {
  const defaults = {
    "user-emmet-enabled": true
  };

  for (let key in defaults) {
    Storage.set(key, defaults[key]);
  }
}
