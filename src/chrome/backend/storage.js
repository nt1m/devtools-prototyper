Cu.import("resource://gre/modules/Services.jsm");

const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;

let Storage = {
  get(pref) {
    let prefname = prefPrefix + pref;
    if (!Services.prefs.getPrefType(prefname)) {
      Services.prefs.setCharPref(prefname, "");
      this.enablePrefSync(pref);
    }
    let result = Services.prefs.getCharPref(prefname);

    try {
      result = JSON.parse(result);
    } catch(e) {
      // nevermind
    }

    return result;
  },
  set(pref, value) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    Services.prefs.setCharPref(prefPrefix + pref, value);
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
  enablePrefSync(pref) {
    Services.prefs.setBoolPref(syncPrefPrefix + pref, true);
  }
};

if (!Storage.get("initialized")) {
  const defaults = {
    "settings-emmet-enabled": true,
    "settings-gist-public": true,
    "injected-libraries": [],
    "initialized": true
  };

  for (let key in defaults) {
    Storage.set(key, defaults[key]);
  }
}
