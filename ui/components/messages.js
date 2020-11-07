import BaseElement from "./base.js";

class Success extends BaseElement {
    stylesheetsLoadedCallback() {
        setTimeout(()=>this.outerHTML="",5*1000);
    }
}
class Error extends BaseElement {
    stylesheetsLoadedCallback() {
        setTimeout(()=>this.outerHTML="",5*1000);
    }
}

customElements.define("message-success", Success);
customElements.define("message-error", Error);


export default {Success};
