const CodeMirror = require("devtools/sourceeditor/editor");

const MAC = navigator.platform.toLowerCase().includes("mac");
const KEYS = {
  mac: {
    "Cmd-Enter": Code.run,
    "Cmd-R": Code.run,
    "Cmd-S": function () {}
  },
  other: {
    "Ctrl-Enter": Code.run,
    "Ctrl-R": Code.run,
    "Ctrl-S": function () {}
  }
};

let Editor = React.createClass({
  render() {
    const cls = "devtools-main-content" + (!this.state.active ? "hidden" : "");
    return React.createElement("div", { className: cls,
      "data-lang": this.props.lang,
      id: this.props.lang + "-editor",
      ref: "container" });
  },
  getInitialState() {
    return { active: true };
  },
  componentDidMount() {
    const lang = this.props.lang;

    const config = {
      lineNumbers: true,
      readOnly: false,
      autoCloseBrackets: "{}()[]",
      extraKeys: MAC ? KEYS.mac : KEYS.other
    };

    // Enabled Emmet for HTML and CSS
    if (Settings.get("emmet-enabled") && (lang === "html" || lang === "css")) {
      config.externalScripts = [`${ basePath }/content/lib/emmet.min.js`];
    }

    let sourceEditor = new CodeMirror(config);

    this.props.cm = sourceEditor;

    const container = React.findDOMNode(this.refs.container);
    sourceEditor.appendTo(container).then(function () {
      Code.load(lang);
      sourceEditor.on("change", function () {
        Code.save(lang);
      });
      sourceEditor.setMode(CodeMirror.modes[lang].name);
    });
  }
});
