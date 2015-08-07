let Settings = {
  get: function(key) {
    Storage.get(`settings-${key}`);
  },
  set: function(key, value) {
    Storage.set(`settings-${key}`, value);
  }
};

if (!Settings.get("initialized")) {
  const defaults = {
    "emmet-enabled": true
  };

  for (let key in defaults) {
    Settings.set(key, defaults[key]);
  }
}
