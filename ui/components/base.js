export default class BaseElement extends HTMLElement {
  stylesheets = []
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { shadowRoot, stylesheets } = this;
    let stylesheetsLoaded = [];
    shadowRoot.append(...stylesheets.map(s => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = s;
      stylesheetsLoaded.push(new Promise(r => {
        link.addEventListener("load", r);
      }));
      return link;
    }));
    Promise.all(stylesheetsLoaded).then(() => {
      if (this.stylesheetsLoadedCallback) {
        this.stylesheetsLoadedCallback();
      }
    });
  }
}
