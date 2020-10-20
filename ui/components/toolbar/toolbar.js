import BaseElement from "../base.js";

// Enum for button position
const Position = {
  TOP: function(){},
  BOTTOM: function(){}
};

export default class Toolbar extends BaseElement {
  stylesheets = ["components/toolbar/toolbar.css"]
  buttons = []
  connected() {
    this.addButton({name: "Launch", action: () => document.dispatchEvent(new Event('launch'))});
  }
  addButton({icon, name, alt, position, action} = {}) {
    name = name || "";
    alt = alt || name;
    position = position || Position.TOP; 
    const el = document.createElement('div');
    el.classList.add('btn');
    if (action) el.addEventListener('click', action);
    el.innerText = name;
    el.alt = alt;
    this.shadowRoot.append(el);
  }
  addSeparator() {
    this.shadowRoot.append(document.createElement('hr'));
  }
}

customElements.define("prototyper-toolbar", Toolbar);