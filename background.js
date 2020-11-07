"use strict";
let tab = null;
const data = { doc: "", js: "" };
chrome.tabs.onRemoved.addListener(id => {
    if (tab && tab.id === id) tab = null;
});
const update = (id, info) => {
  if (tab && tab.id === id) {
    if (info.status === "loading" && info.url?.startsWith("http")) {
      tab = null;
    }
    if (info.status !== "complete") return;
    const {doc, js} = data;
    chrome.tabs.executeScript(tab.id,
      {
          code:`
          document.documentElement.innerHTML = 
              \`${doc.split('`').join('\\`')}\`;
          try {
            eval(\`${js.split('`').join('\\`')}\`);
          } catch (e) {
            console.error(e);
          }`
      });
  }
};
chrome.tabs.onUpdated.addListener(update);

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  let devToolsListener = async function({doc, js, action, actionParams}, sender, sendResponse) {
    data.doc = doc || data.doc;
    data.js = js || data.js;
    const run = async () => {
      if (doc) {
        chrome.tabs.executeScript(tab.id, {code:"window.location.reload()"});
      }
      if (action) {
        const params = actionParams
          .map(e => JSON.stringify(e).split('`').join('\\`'))
          .join(', ');
        chrome.tabs.executeScript(tab.id, {code:`(${action})(${params});`});
      }
    };
    if (tab) {
        chrome.tabs.update(tab.id, {active: true})
        run ()
    } else chrome.tabs.create({url: "vide.html"}, t => {
        tab = t;
        run ()
    });
  };
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function() {
    devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});
