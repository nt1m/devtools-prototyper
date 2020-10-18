import BaseElement from "../base.js";

export default class Toolbar extends BaseElement {
  stylesheets = ["./toolbar.css"]
  connectedCallback() {

  }
}

customElements.define("prototyper-toolbar", Toolbar);