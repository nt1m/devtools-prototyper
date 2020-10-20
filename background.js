"use strict";
let tab = null;
chrome.tabs.onRemoved.addListener(id => {
    if (tab && tab.id === id) tab = null;
})
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  let devToolsListener = async function({doc, js}, sender, sendResponse) {
    const show = () => chrome.tabs.executeScript(tab.id,
        {
            code:`document.documentElement.innerHTML = 
                \`${doc.split('`').join('\\`')}\`;
            ${js}`
        });
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
