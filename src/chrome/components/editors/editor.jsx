let CodeMirror;
try {
  CodeMirror = require("devtools/client/sourceeditor/editor");
} catch(e) {
  CodeMirror = require("devtools/sourceeditor/editor");
}
const EMMET_URL = `${basePath}/content/lib/emmet.min.js`;

const IS_MAC = navigator.platform.toLowerCase().includes("mac");

// openExportMenu is defined in lib/utils.js
const KEYS = {
  mac: {
    "Cmd-Enter": Code.run,
    "Cmd-R": Code.run,
    "Cmd-S": openExportMenu,
    "Esc": false
  },
  other: {
    "Ctrl-Enter": Code.run,
    "Ctrl-R": Code.run,
    "Ctrl-S": openExportMenu,
    "Esc": false
  }
};

let Editor = React.createClass({
  mixins: [Togglable],
  render() {
    const cls = "devtools-main-content" + (!this.state.active ? "hidden" : "");
    return (
      <div className={cls}
        data-lang={this.props.lang}
        id={this.props.lang + "-editor"}
        ref="container">
      </div>
    );
  },
  getInitialState() {
    return {
      active: true
    };
  },
  updateEmmet() {
    this.componentDidMount();
  },
  componentDidMount() {
    const lang = this.props.lang;

    const config = {
      lineNumbers: true,
      readOnly: false,
      autoCloseBrackets: "{}()[]",
      extraKeys: IS_MAC ? KEYS.mac : KEYS.other
    };

    // Enabled Emmet for HTML and CSS
    if (Settings.get("emmet-enabled") && (lang === "html" || lang === "css")) {
      config.externalScripts = [EMMET_URL];
    }

    let sourceEditor = this.props.cm = new CodeMirror(config);

    const container = React.findDOMNode(this.refs.container);
    container.innerHTML = "";

    sourceEditor.appendTo(container).then(() => {
      Code.load(lang);
      sourceEditor.on("change", () => {
        Code.save(lang);
        if (Settings.get("live-edit-enabled")) {
          Code.update(lang, sourceEditor.getText());
        }
      });
      sourceEditor.setMode(CodeMirror.modes[lang].name);
    });
  }
});
