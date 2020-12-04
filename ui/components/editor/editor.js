import BaseElement from "../base.js";
import Storage from "../../helpers/storage.js";

const MODE_MAPPING = {
  html: "htmlmixed",
  js: "javascript",
};

const PLACEHOLDER_MAPPING = {
  html: "<!-- HTML -->\n",
  css: "/* CSS */\n",
  js: "// JS\n",
};



export default class Editor extends BaseElement {
  constructor() {
    super();
    // JS class fields not supported by addons-linter
    this.stylesheets = ["lib/codemirror.min.css", "components/editor/editor.css"];
    this._options = {
      lineNumbers: true,
      autoRefresh: true,
      autoCloseBrackets: true,
      matchBrackets: true,
    };
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

  async stylesheetsLoadedCallback() {
    const { language, _options } = this;

    const container = document.createElement("div");
    container.classList.add("container");
    this.shadowRoot.appendChild(container);

    // Setup codemirror
    this._codeMirror = CodeMirror(container, {
      ..._options,
      mode: MODE_MAPPING[language] ?? language,
    });

    if (language == "html") {
      emmetCodeMirror(this._codeMirror, {
        ...emmetCodeMirror.defaultKeymap,
        Tab: "emmet.expand_abbreviation"
      });
    }

    // Restore stored code or show placeholder code
    const storageKey = "editor." + language + ".value";
    this.value = await Storage.get(storageKey, PLACEHOLDER_MAPPING[language]);

    // Store code when changed
    this._codeMirror.on("change", () => {
      Storage.set(storageKey, this.value);
    });
  }
}

customElements.define("prototyper-editor", Editor);