import Editor from "./components/editor/editor.js";
import Toolbar from "./components/toolbar/toolbar.js";
import Messages from "./components/messages.js";

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
    mode = globalThis.chrome?.extension ? "extension" : "web",
  } = {}) {
    this.mode = mode;
    this.container = container;

    // Setup container
    container.classList.add("prototyper-container", mode);

    this.setupTheme();
    globalThis.chrome?.devtools.panels.onThemeChanged.addListener(this.setupTheme);

    this.setupChildren();
  }

  setupTheme() {
    document.documentElement.classList.toggle(
      "dark",
      globalThis.chrome?.devtools.panels.themeName === "dark"
    );
  }

  setupChildren() {
    // Setup editors
    const elements = ["html", "css", "js"].map(language => {
      const element = document.createElement("prototyper-editor");
      element.language = language;
      this.container.append(element);
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
      shortcuts: ["KeyB"]
    });
    const exportBtn = toolbar.addButton({
      name: "Export",
    });
    toolbar.addButton({
      parent: exportBtn,
      name: "Jsfiddle",
      action: () => {
        const [html, css, js] = elements.map(e => e.value);
        const params = {html, css, js};
        const action = function(params) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "http://jsfiddle.net/api/post/library/pure/";
          form.style.display = "none";
          for (var i in params) {
            const input = document.createElement("input");
            input.name = i;
            input.value = params[i];
            form.append(input);
          }
          document.body.append(form);
          form.submit();
        };
        if (this.mode === "web") action(params);
        if (this.mode === "extension") {
          const connexion = chrome.runtime.connect();
          connexion.postMessage({
            action: action.toString(),
            actionParams: [params],
          });
        }
      }
    });
    toolbar.addButton({
      parent: exportBtn,
      name: "Base64 url",
      action: () => {
        const data = "data:text/html;base64," + btoa(getPrototype(...elements.map(e => e.value)));
        navigator.clipboard?.writeText(data).then(() => {
          const success = document.createElement("message-success");
          success.setAttribute("text", "Copied !");
          document.body.append(success);
        }, () => {
          const error = document.createElement("message-error");
          error.setAttribute("text", "Cannot copy the url !");
          document.body.append(error);
        });
      }
    });
    this.container.prepend(toolbar);

    // Setup preview iframe for non-extension mode
    if (this.mode != "extension") {
      this.previewIframe = document.createElement("iframe");
      const iframecontainer = document.createElement("div");
      iframecontainer.setAttribute("tabindex", -1);
      iframecontainer.classList.add("prototyper-preview");
      iframecontainer.append(this.previewIframe);
      this.container.append(iframecontainer);
    }

    window.addEventListener("load", () => {
      this.container.classList.add("loaded");
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
