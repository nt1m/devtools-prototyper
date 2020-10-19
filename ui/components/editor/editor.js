import BaseElement from "../base.js";

export default class Editor extends BaseElement {
  stylesheets = ["ext/codemirror.min.css", "components/editor/editor.css"]
  connected() {
    CodeMirror(this.shadowRoot, {
      value: "// js\n",
      mode:  "javascript"
    });
    CodeMirror(this.shadowRoot, {
      value: "/* css *\/\n",
      mode:  "css"
    });
    CodeMirror(this.shadowRoot, {
      value: "<!-- html -->\n",
      mode:  "html"
    });
    this.shadowRoot.append(document.createElement('iframe'))
  }
}

customElements.define("prototyper-editor", Editor);