import BaseElement from "../base.js";

const MODE_MAPPING = {
  html: "htmlmixed",
  js: "javascript",
};

export default class Editor extends BaseElement {
  stylesheets = ["lib/codemirror.min.css", "components/editor/editor.css"]
  _options = {
    lineNumbers: true,
    autoRefresh: true,
    autoCloseBrackets: true,
    matchBrackets: true,
  }

  get language() {
    return this.getAttribute("language");
  }
  set language(newLang) {
    this.setAttribute("language", newLang);
  }

  get value() {
    return this._codeMirror.getValue();
  }
  set value(newVal) {
    if (!this._codeMirror) {
      this._options.value = newVal;
    } else {
      this._codeMirror.getDoc().setValue(newVal);
    }
  }

  get options() {
    return this._options;
  }
  set options({options, extend = false}) {
    if (extend) {
      this._options = {
        ...this._options,
        ...options,
      };
    } else {
      this._options = options;
    }
  }

  stylesheetsLoadedCallback() {
    const { language, _options } = this;

    this._codeMirror = CodeMirror(this.shadowRoot, {
      ..._options,
      mode: MODE_MAPPING[language] ?? language,
    });

    if (language == "html") {
      emmetCodeMirror(this._codeMirror, {
        ...emmetCodeMirror.defaultKeymap,
        Tab: "emmet.expand_abbreviation"
      });
    }
  }
}

customElements.define("prototyper-editor", Editor);