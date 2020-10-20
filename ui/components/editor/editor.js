import BaseElement from "../base.js";


let isExt = false;
try {
  isExt = chrome ? true : false
} catch (error) {}
export default class Editor extends BaseElement {
  stylesheets = ["ext/codemirror.min.css", "components/editor/editor.css"]
  connected() {
    const {shadowRoot} = this;
    const options = {
      lineNumbers: true,
      autoRefresh:true,
    };

    const placeholder = {
      html: "<!-- html -->",
      css: "/* css */",
      js: "// js"
    };

    const [html, css, js] = ["html", "css", "js"].map(lang => {
      const div = document.createElement('div');
      div.setAttribute("lang", lang);
      div.classList.add('code-container');
      const code = CodeMirror(div, {
          ...options,
          value: placeholder[lang]+"\n",
          mode:  lang
        });
      return code
    });
    // Workaroud...
    setTimeout(() => 
      [html, css, js].forEach(e=>{
        shadowRoot.append(e.display.wrapper.parentElement);
        e.refresh();
    }))
    const iframe = document.createElement('iframe');
    if (!isExt) {
      shadowRoot.append(iframe)
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