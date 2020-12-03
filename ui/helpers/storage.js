const WebStorage = {
  async get(key, defaultValue) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
    } catch (e) {
      console.warn(e);
      return defaultValue;
    }
  },

  async set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key) {
    return localStorage.removeItem(key);
  },

  async clear() {
    return localStorage.clear();
  }
};

const ExtensionStorage = {
  get(key, defaultValue) {
    return new Promise(resolve => {
      chrome.storage.local.get(key, results => {
        resolve(results?.[key] ?? defaultValue);
      });
    });
  },

  async set(key, value) {
    const params = {};
    params[key] = value;
    await chrome.storage.local.set(params);
  },

  async remove(key) {
    await chrome.storage.local.remove(key);
  },

  async clear() {
    return chrome.storage.local.clear();
  }
};

export default Storage = globalThis.chrome?.storage ? ExtensionStorage : WebStorage;
