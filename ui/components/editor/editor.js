import BaseElement from "../base.js";

export default class Editor extends BaseElement {
  stylesheets = ["./editor.css"]
  connectedCallback() {
    const editor = document.createElement("div");
    editor.contentEditable = true;
    this.append(editor);
  }
}

customElements.define("prototyper-editor", Editor);