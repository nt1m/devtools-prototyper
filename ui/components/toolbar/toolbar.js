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
    const launch = this.addButton({name: "Launch", action: () => document.dispatchEvent(new Event('launch'))});
    const beautify = this.addButton({name: "Beautify", action: () => document.dispatchEvent(new Event('beautify'))});
    document.addEventListener('keydown', e => {
      const ctrl_s = e.ctrlKey && e.code === "KeyS";
      const ctrl_enter = e.ctrlKey && e.code === "Enter";
      if (ctrl_s || ctrl_enter) {
        e.stopPropagation();
        e.preventDefault();
        launch.click();
      }
    })
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
    return el;
  }
  addSeparator() {
    this.shadowRoot.append(document.createElement('hr'));
  }
}

customElements.define("prototyper-toolbar", Toolbar);