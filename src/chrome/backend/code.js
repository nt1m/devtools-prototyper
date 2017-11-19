let beautify;
try {
  beautify = require("devtools/shared/jsbeautify/beautify");
} catch(e) {
  beautify = require("devtools/jsbeautify");
}
let Code = {
  run(ctrlOrCmd) {
    Code.openTab(ctrlOrCmd);
  },
  getCode() {
    return buildCode();
  },
  get prototypeURL() {
    if (Settings.get("chrome-privilege-enabled")) {
      return browser.extension.getURL("chrome/prototype.html");
    }
    return "data:text/html;charset=utf-8,";
  },
  openTab(ctrlOrCmd) {
    let currentTab;

    // If Prototyper is running on a tab by itself
    if (window.top == window &&
        !this.running) {
      browser.tabs.create({
        url: this.prototypeURL,
        // inNewWindow: ctrlOrCmd,
        // onReady: (tab) => {
        //   currentTab = this.currentTab = tab;
        //   this.attachContentScript(tab);
        // }
      });
      return;
    }

    // If Prototyper is running in the toolbox, but the prototype isn't ran yet
    if (!this.currentTab) {
      currentTab = this.currentTab = tabs.activeTab;
    } else {
      // If the Prototype is already ran.
      currentTab = this.currentTab;
    }
    currentTab.once("ready", () => {
      this.attachContentScript(currentTab);
    });
    if (this.running) {
      currentTab.reload();
    } else {
      currentTab.url = this.prototypeURL;
    }
  },
  attachContentScript(tab) {
    let worker = this.currentWorker = tab.attach({
      contentScript: PrototypeContentScript
    });

    const editors = app.props.editors.refs;
    let html = Code.getCode();
    let js = editors.js.props.cm.getText().replace(/\n/g, "\n\t\t");
    let libs = app.props.libraries.state.injected;
    worker.port.emit("new-prototype", {html, js, libs});
  },
  get running() {
    return this.currentTab &&
           this.currentTab.url === this.prototypeURL &&
           this.currentWorker;
  },
  save(lang) {
    const editors = app.props.editors.refs;

    Storage.set(lang, editors[lang].props.cm.getText());
  },
  load(lang) {
    const editors = app.props.editors.refs;

    let cm = editors[lang].props.cm;
    cm.setText(Storage.get(`${lang}`));
  },
  update(lang, newCode) {
    if (this.running) {
      this.currentWorker.port.emit(`${lang}-update`, newCode);
    }
  },
  beautify() {
    const editors = app.props.editors.refs;

    for (let lang in editors) {
      let cm = editors[lang].props.cm;
      let pretty = beautify[lang](cm.getText());
      cm.setText(pretty);
    }
  },
  exportCode(service) {
    let properties = EXPORT_SERVICES.find(item => item.id === service);

    if (service == "local") {
      let zip = new JSZip();
      zip.file("index.html", exportedCode.html);

      let cssFolder = zip.folder("css");
      cssFolder.file("style.css", exportedCode.css);

      let jsFolder = zip.folder("js");
      jsFolder.file("script.js", exportedCode.js);

      let blob = zip.generate({type: "blob"});
      let url = URL.createObjectURL(blob);

      // This is the only way to make sure the ZIP has a file name
      let a = document.createElement("a");
      a.href = url;
      a.download = "prototype.zip";
      a.hidden = true;
      document.body.appendChild(a);
      a.click();
      a.remove();

      return;
    }

    request(properties).then(response => {
      if (service.indexOf("gist") > -1) {
        tabs.open(response.html_url);
      }
    });
  },
  getLibraries() {
    let injected = app.props.libraries.state.injected;

    return injected.reduce((a, b) => {
      return a + `<script src="${b.latest}"></script>\n\t\t`;
    }, "");
  }
};
