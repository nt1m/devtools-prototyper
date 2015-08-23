const beautify = require("devtools/jsbeautify");

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
    const mm = ``;

    tabs.activeTab.once("ready", () => {
      let csURL = `${basePath}/content/backend/prototype-contentscript.js`;
      let worker = tabs.activeTab.attach({
        contentScriptFile: csURL
      });

      worker.port.emit("html", html);
    });
    if (tabs.activeTab.url === prototypeURL) {
      tabs.activeTab.reload();
    } else {
      tabs.activeTab.url = prototypeURL;
    }
  },
  save(lang) {
    const editors = app.props.editors.refs;

    Storage.set(lang, editors[lang].props.cm.getText());
  },
  load(lang) {
    const editors = app.props.editors.refs;

    let cm = editors[lang].props.cm;
    cm.setText(Storage.get(`editor-${lang}`));
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
