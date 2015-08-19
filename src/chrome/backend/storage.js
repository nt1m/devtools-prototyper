Cu.import("resource://gre/modules/Services.jsm");

const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;

let Storage = {
  get(pref) {
    let prefname = prefPrefix + pref;
    let type = Services.prefs.getPrefType(prefname);

    const {PREF_BOOL} = Services.prefs;

    if (!type) {
      Services.prefs.setCharPref(prefname, "");
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
  set(pref, value) {
    let prefname = prefPrefix + pref;
    let type = Services.prefs.getPrefType(prefname);

    if (type === Services.prefs.PREF_BOOL) {
      Services.prefs.setBoolPref(prefname, value);
      return;
    }

    if (typeof value === "object") {
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
  sync(pref, value) {
    Services.prefs.setBoolPref(syncPrefPrefix + pref, value);
  }
};

if (!Storage.get("initialized")) {
  const defaults = {
    "settings-emmet-enabled": true,
    "injected-libraries": "[]",
    "initialized": true
  };

  for (let key in defaults) {
    Storage.set(key, defaults[key]);
  }

  Storage.sync("initialized", false);
}
