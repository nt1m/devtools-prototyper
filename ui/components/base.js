export default class BaseElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { shadowRoot, stylesheets } = this;
    if (stylesheets) {
      shadowRoot.append(...stylesheets.map(s => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = s;
        return link;
      }));
    }
  }
}
