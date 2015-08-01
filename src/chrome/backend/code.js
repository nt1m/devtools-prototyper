let tabs = require("sdk/tabs");

let Code = {
  run() {
    let html = Code.getCode();
    Code.openTab(html);
  },
  getCode() {
    return buildCode();
  },
  openTab(html) {
    const editors = app.props.editors.props;
    let js = editors.js.props.cm.getText().replace(/\n/g, "\n\t\t");
    const mm = `self.port.on('html', html => {
      document.documentElement.innerHTML = html
      ${js}
    });`;
    tabs.open({
      url: "chrome://devtools-prototyper/content/prototype.html",
      onReady(tab) {
        let worker = tab.attach({
          contentScript: mm
        });

        worker.port.emit("html", html);
      }
    });
  },
  save() {

  }
};
