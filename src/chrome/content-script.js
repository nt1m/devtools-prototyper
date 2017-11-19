let PrototypeManager = {
  onNewPrototype({html, js, libs}) {
    document.documentElement.innerHTML = html;

    let head = document.querySelector("head");
    let script = document.createElement("script");
    script.type = "text/javascript;version=1.8";
    script.async = true;
    script.innerHTML = js;
    head.appendChild(script);

    let icon = document.createElement("link");
    icon.rel = "shortcut icon";
    icon.href = "${basePath}/skin/images/page-icon.svg";
    head.appendChild(icon);

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
PrototypeManager.init();