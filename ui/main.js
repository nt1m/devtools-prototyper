import Editor from "./components/editor/editor.js";
import Toolbar from "./components/toolbar/toolbar.js";

let getPrototype = (html, css, js) =>
  `<!DOCTYPE html>
<html>
<head>
  <title>Prototype</title>
  <meta charset="utf-8">
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    (function(){
      ${js}
    })();
  </script>
</body>
</html>
`;

class Main {
  constructor({
    container = document.body,
    mode = window.chrome?.extension ? "extension" : "web",
  } = {}) {
    this.mode = mode;
    container.classList.add("prototyper-container", mode);

    // Setup editors
    const editors = [
      {
        language: "html",
        value: "<!-- html -->\n",
      },
      {
        language: "css",
        value: "/* css */\n",
      },
      {
        language: "js",
        value: "// js\n",
      }
    ];

    const elements = editors.map(({ language, value }) => {
      const element = document.createElement("prototyper-editor");
      element.language = language;
      element.value = value;
      container.append(element);
      return element;
    });

    // Setup toolbar
    const toolbar = document.createElement("prototyper-toolbar");
    toolbar.addButton({
      name: "Launch",
      action: () => {
        this.launch(...elements.map(e => e.value));
      },
      shortcuts: ["Enter", "KeyS"]
    });
    toolbar.addButton({
      name: "Beautify",
      action: () => {
        const [html, css, js] = elements;
        html.value = beautifier.html(html.value);
        css.value = beautifier.css(css.value);
        js.value = beautifier.js(js.value);
      },
    });
    container.prepend(toolbar);

    // Setup preview iframe for non-extension mode
    if (this.mode != "extension") {
      this.previewIframe = document.createElement("iframe");
      this.previewIframe.classList.add("prototyper-preview");
      container.append(this.previewIframe);
    }

    window.addEventListener("load", () => {
      container.classList.add("loaded");
    });
  }

  launch(html, css, js) {
    const doc = getPrototype(html, css, js);
    if (this.mode == "extension") {
      const connexion = chrome.runtime.connect();
      connexion.postMessage({
        doc,
        js,
      });
    } else {
      this.previewIframe.src = "data:text/html;base64," + btoa(doc);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new Main();
});
