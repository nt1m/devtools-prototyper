import BaseElement from "../base.js";


let isExt = false;
try {
  isExt = chrome && chrome.extension ? true : false
} catch (error) {}
export default class Editor extends BaseElement {
  stylesheets = ["ext/codemirror.min.css", "components/editor/editor.css"]
  connected() {
    const {shadowRoot} = this;
    const options = {
      lineNumbers: true,
      autoRefresh:true,
      autoCloseBrackets: true,
      matchBrackets: true,
    };
    const opt = {
      html: {
        value:"<!-- html -->\n",
        mode: "htmlmixed"
      },
      css: {
        autoCloseBrackets: true,
        value: "/* css */\n",
        mode: "css"
      },
      js: {
        value: "// js\n",
        autoCloseBrackets: true,
        mode: "javascript"
      }
    };

    const [html, css, js] = ["html", "css", "js"].map(lang => {
      const div = document.createElement('div');
      div.setAttribute("lang", lang);
      div.classList.add('code-container');
      const code = CodeMirror(div, {
          ...options,
          ...opt[lang]
        });
      return code
    });
    console.log(emmetCodeMirror(html, {
      ...emmetCodeMirror.defaultKeymap,
      'Tab': 'emmet.expand_abbreviation'
    }));
    // Workaroud...
    window.onload = () => {
      [html, css, js].forEach(e=>{
        shadowRoot.append(e.display.wrapper.parentElement);
        e.refresh();
      });
    };
    const iframe = document.createElement('iframe');
    if (!isExt) {
      shadowRoot.append(iframe)
    }
    document.addEventListener('launch', () => {
      const doc = `
      <html>
        <head>
          <title>Prototyper</title>
          <link rel="icon" href="${isExt?chrome.runtime.getURL("./ui/images/icon.svg"):""}" sizes="any" type="image/svg+xml">
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
    document.addEventListener('beautify', () => {
      js.getDoc().setValue(beautifier.js(js.getValue()));
      html.getDoc().setValue(beautifier.html(html.getValue()));
      css.getDoc().setValue(beautifier.css(css.getValue()));
    });
  }
}

customElements.define("prototyper-editor", Editor);