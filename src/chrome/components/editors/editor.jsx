const CodeMirror = require("devtools/sourceeditor/editor");
const EMMET_URL = `${basePath}/content/lib/emmet.min.js`;

const IS_MAC = navigator.platform.toLowerCase().includes("mac");
const KEYS = {
  mac: {
    "Cmd-Enter": Code.run,
    "Cmd-R": Code.run,
    "Cmd-S": () => {},
    "Esc": false
  },
  other: {
    "Ctrl-Enter": Code.run,
    "Ctrl-R": Code.run,
    "Ctrl-S": () => {},
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

    let sourceEditor = new CodeMirror(config);

    this.props.cm = sourceEditor;

    const container = React.findDOMNode(this.refs.container);
    container.innerHTML = "";

    sourceEditor.appendTo(container).then(() => {
      Code.load(lang);
      sourceEditor.on("change", () => {
        Code.save(lang);
      });
      sourceEditor.setMode(CodeMirror.modes[lang].name);
    });
  }
});
