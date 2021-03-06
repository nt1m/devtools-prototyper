import BaseElement from "../base.js";

export default class Toolbar extends BaseElement {
  constructor() {
    super();
    // JS class fields not supported by addons-linter
    this.stylesheets = ["components/toolbar/toolbar.css"];
  }

  addButton({
    parent = this.shadowRoot,
    icon,
    name = "",
    alt = name,
    position = "top",
    action,
    shortcuts,
  } = {}) {
    const el = document.createElement('div');
    const span = document.createElement('span');
    el.classList.add('btn');
    el.addEventListener('click', function(e) {
      if (el.classList.contains('folder')) el.classList.toggle('active');
      if (action) action(e, el);
      e.stopPropagation();
    });
    span.textContent = name;
    el.alt = alt;
    el.append(span)
    parent.classList?.add('folder');
    parent.append(el);
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
