const settingsPrefix = "settings-";
let Settings = {
  get(key) {
    return Storage.get(settingsPrefix + key);
  },
  set(key, value, shouldSync = true) {
    return Storage.set(settingsPrefix + key, value, shouldSync);
  },
  refreshSyncState() {
    Storage.entries().forEach(arr => {
      Storage.setSync(arr[0], Settings.get("sync-enabled"));
    });
  },
  entries() {
    let entries = Storage.entries(settingsPrefix);
    entries.forEach(arr => {
      let smallKey = arr[0].slice(settingsPrefix.length);
      arr[0] = smallKey;
    });

    return entries;
  },
  object() {
    let obj = {};

    for (let [key, value] of this.entries()) {
      obj[key] = value;
    }

    return obj;
  }
};
