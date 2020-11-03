import BaseElement from "../base.js";

export default class Toolbar extends BaseElement {
  stylesheets = ["components/toolbar/toolbar.css"]

  addButton({
    icon,
    name = "",
    alt = name,
    position = "top",
    action,
    shortcuts,
  } = {}) {
    const el = document.createElement('div');
    el.classList.add('btn');
    if (action) el.addEventListener('click', action);
    el.textContent = name;
    el.alt = alt;
    this.shadowRoot.append(el);
    let isMac = window.navigator.platform.startsWith("Mac");
    if (shortcuts && shortcuts.length) {
      document.addEventListener("keydown", e => {
        if ((isMac ? e.metaKey : e.ctrlKey) && shortcuts.includes(e.code)) {
          e.stopPropagation();
          e.preventDefault();
          action();
        }
      });
    }
    return el;
  }
  addSeparator() {
    this.shadowRoot.append(document.createElement('hr'));
  }
}

customElements.define("prototyper-toolbar", Toolbar);
