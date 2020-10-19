export default class BaseElement extends HTMLElement {
  stylesheets = []
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { shadowRoot, stylesheets } = this;
    shadowRoot.append(...stylesheets.map(s => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = s;
      return link;
    }));
    if (this.connected) this.connected();
  }
}
