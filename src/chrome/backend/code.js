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
    const mm = `self.port.on("html", html => {
      document.documentElement.innerHTML = html
      let script = document.querySelector("script");

      let js = script.textContent;
      script.remove();

      let el = document.createElement("script");
      el.type = "text/javascript;version=1.8";
      el.textContent = js;
      document.body.appendChild(el);
    });`;

    tabs.activeTab.once("ready", () => {
      let worker = tabs.activeTab.attach({
        contentScript: mm
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

    Storage.set(`editor-${lang}`, editors[lang].props.cm.getText());
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
      if (service === "gist") {
        tabs.open(response.html_url);
      }
    });
  }
};
