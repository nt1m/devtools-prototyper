Cu.import("resource://gre/modules/Services.jsm");

const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;

let Storage = {
  defaults: {
    "settings-sync-enabled": true,
    "settings-live-edit-enabled": true,
    "settings-emmet-enabled": true,
    "injected-libraries": "[]",
    "initialized": true
  },
  get(pref) {
    let prefname = prefPrefix + pref;
    let type = Services.prefs.getPrefType(prefname);

    const {PREF_BOOL} = Services.prefs;

    if (!type) {
      if (this.defaults.hasOwnProperty(pref)) {
        Storage.set(pref, this.defaults[pref]);
      }
      else {
        Services.prefs.setCharPref(prefname, "");
      }
    }

    let result = type === PREF_BOOL ? Services.prefs.getBoolPref(prefname)
                                    : Services.prefs.getCharPref(prefname);

    try {
      result = JSON.parse(result);
    } catch(e) {
      // nevermind
    }

    return result;
  },
  set(pref, value, shouldSync = true) {
    let prefname = prefPrefix + pref;
    let type = Services.prefs.getPrefType(prefname);
    let valueType = typeof value;

    this.setSync(pref, shouldSync);

    if (valueType === "boolean" ||
        type === Services.prefs.PREF_BOOL) {
      Services.prefs.setBoolPref(prefname, value);
      return;
    }

    if (valueType === "object") {
      value = JSON.stringify(value);
    }
    Services.prefs.setCharPref(prefname, value);
  },
  entries(search = "") {
    let keys = Services.prefs.getChildList(prefPrefix + search);
    return keys.map(key => {
      let smallKey = key.slice(prefPrefix.length);
      return [smallKey, this.get(smallKey)];
    });
  },
  object(search = "") {
    let obj = {};

    for (let [key, value] of this.entries(search)) {
      obj[key] = value;
    }

    return obj;
  },
  setSync(pref, value) {
    if (!this.get("settings-sync-enabled")) {
      value = false;
    }
    Services.prefs.setBoolPref(syncPrefPrefix + pref, value);
  }
};

if (!Storage.get("initialized")) {
  const defaults = Storage.defaults;

  for (let key in defaults) {
    Storage.set(key, defaults[key]);
  }

  Storage.setSync("initialized", false);
}
