let tabs = require("sdk/tabs");
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
    if (this.previousTab) {
      this.previousTab.close();
    }

    const editors = app.props.editors.refs;
    const mm = `self.port.on('html', html => {
      document.documentElement.innerHTML = html
      let script = document.querySelector('script');

      let js = script.textContent;
      script.remove();

      let el = document.createElement('script');
      el.textContent = js;
      document.body.appendChild(el);
    });`;

    tabs.open({
      url: "about:blank",
      onReady: (tab) => {
        this.previousTab = tab;
        let worker = tab.attach({
          contentScript: mm
        });

        worker.port.emit("html", html);
      }
    });
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
  }
};
