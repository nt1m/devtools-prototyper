"use strict";
let tab = null;
const data = {doc: "", js: ""};
chrome.tabs.onRemoved.addListener(id => {
    if (tab && tab.id === id) tab = null;
});
const update = id => {
  if (tab && tab.id === id) {
    const {doc, js} = data;
    chrome.tabs.executeScript(tab.id,
      {
          code:`
          document.documentElement.innerHTML = 
              \`${doc.split('`').join('\\`')}\`;
          try {
            ${js}
          } catch (e) {
            console.error(e);
          }`
      });
  }
};
chrome.tabs.onUpdated.addListener(update);

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  let devToolsListener = async function({doc, js}, sender, sendResponse) {
    data.doc = doc;
    data.js = js;
    const show = async () => {

      chrome.tabs.executeScript(tab.id, {code:"window.location.reload()"});


    };
    if (tab) {
        chrome.tabs.update(tab.id, {active: true})
        show ()
    } else chrome.tabs.create({url: "vide.html"}, t => {
        tab = t;
        show ()
    });
  };
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function() {
    devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});
