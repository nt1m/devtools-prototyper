"use strict";
let tab = null;
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  let devToolsListener = async function({doc, js}, sender, sendResponse) {
    console.log("reponse", await chrome.tabs.create({url: "vide.html"}, t => {
        tab = t;
        chrome.tabs.executeScript(t.id,
            {
                code:`document.documentElement.innerHTML = 
                    \`${doc.split('`').join('\\`')}\`;
                ${js}`
            });
    }));
  };
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function() {
    devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});
