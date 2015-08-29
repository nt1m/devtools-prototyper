const beautify = require("devtools/jsbeautify");
// The content script can't be placed in a separate file because the SDK
// forbids chrome:// URIs
let PrototypeContentScript = `
let PrototypeManager = {
  onNewPrototype({html, js, libs}) {
    document.documentElement.innerHTML = html;

    let head = document.querySelector("head");
    let script = document.createElement("script");
    script.type = "text/javascript;version=1.8";
    script.async = true;
    script.innerHTML = js;
    head.appendChild(script);

    for (let lib of libs) {
      let libScript = document.createElement("script");
      libScript.src = lib.latest;
      head.appendChild(libScript);
    }
  },
  updateCSS(newCss) {
    document.querySelector("head > style").textContent = newCss;
  },
  updateHTML(newHtml) {
    document.body.innerHTML = newHtml;
  },
  init() {
    self.port.on("new-prototype", this.onNewPrototype.bind(this));
    self.port.on("css-update", this.updateCSS.bind(this));
    self.port.on("html-update", this.updateHTML.bind(this));
  }
};
PrototypeManager.init();`;
let Code = {
  run() {
    let html = Code.getCode();
    Code.openTab(html);
  },
  getCode() {
    return buildCode();
  },
  openTab(html) {
    const prototypeURL = `${basePath}/content/${prototypeName}`;

    tabs.activeTab.once("ready", () => {
      let worker = this.currentWorker = tabs.activeTab.attach({
        contentScript: PrototypeContentScript
      });

      const editors = app.props.editors.refs;
      let js = editors.js.props.cm.getText().replace(/\n/g, "\n\t\t");
      let libs = app.props.libraries.state.injected;
      worker.port.emit("new-prototype", {html, js, libs});
    });
    if (this.running) {
      tabs.activeTab.reload();
    } else {
      tabs.activeTab.url = prototypeURL;
    }
  },
  get running() {
    const prototypeURL = `${basePath}/content/${prototypeName}`;
    return tabs.activeTab.url === prototypeURL &&
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

