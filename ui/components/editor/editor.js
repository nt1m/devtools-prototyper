import BaseElement from "../base.js";


let isExt = false;
try {
  isExt = chrome ? true : false
} catch (error) {}
export default class Editor extends BaseElement {
  stylesheets = ["ext/codemirror.min.css", "components/editor/editor.css"]
  connected() {

    const options = {
      lineNumbers: true,
    };

    const [divhtml, divcss, divjs] = ["html", "css", "js"].map(lang => {
      const div = document.createElement('div');
      div.setAttribute("lang", lang);
      div.classList.add('code-container');
      return div
    });

    const html = CodeMirror(divhtml, {
      ...options,
      value: "<!-- html -->\n",
      mode:  "html"
    });
    const css = CodeMirror(divcss, {
      ...options,
      value: "/* css *\/\n",
      mode:  "css"
    });
    const js = CodeMirror(divjs, {
      ...options,
      value: "// js\n",
      mode:  "javascript"
    });

    this.shadowRoot.append(divhtml)
    this.shadowRoot.append(divcss)
    this.shadowRoot.append(divjs)

    const iframe = document.createElement('iframe');
    if (!isExt) {
      this.shadowRoot.append(iframe)
    }
    document.addEventListener('launch', () => {
      const doc = `
      <html>
        <head>
          <title>Prototyper</title>
          <link rel="icon" href="${isExt?chrome.extension.getURL("ui/images/icon.svg"):""}" sizes="any" type="image/svg+xml">
          <style>
            ${css.getValue()}
          </style>
        </head>
        <body>
          ${html.getValue()}
          <script>
            (function(){${js.getValue()}})();
          </script>
        </body>
      </html>
      `
      document.dispatchEvent(new Event('launched', {doc}));
      if (isExt) {
        const connexion = chrome.runtime.connect();
        connexion.postMessage({doc, js: js.getValue()});
      } else {
        iframe.src = "data:text/html;base64,"+btoa(doc);
      }
    });
  }
}

customElements.define("prototyper-editor", Editor);