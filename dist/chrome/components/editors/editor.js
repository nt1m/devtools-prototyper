const CodeMirror  = require("devtools/sourceeditor/editor");

const MAC = navigator.platform.toLowerCase().includes("mac");
const KEYS = {
  mac: {
    "Cmd-Enter": Code.run,
    "Cmd-R": Code.run,
    "Cmd-S": () => {}
  },
  other: {
    "Ctrl-Enter": Code.run,
    "Ctrl-R": Code.run,
    "Ctrl-S": () => {}
  }
}

let Editor = React.createClass({displayName: "Editor",
  render() {
    return (
      React.createElement("div", {className: "devtools-main-content", 
        "data-lang": this.props.lang, 
        id: this.props.lang + "-editor", 
        ref: "container"}
      )
    );
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
    if (Storage.get("emmet-enabled") && (lang === "html" || lang === "css")) {
      config.externalScripts = [`${basePath}/content/lib/emmet.min.js`];
    }

    let sourceEditor = new CodeMirror(config);

    this.props.cm = sourceEditor;

    const container = React.findDOMNode(this.refs.container);
    sourceEditor.appendTo(container).then(() => {
      sourceEditor.on("change", () => {
        Code.save(lang);
      });
      sourceEditor.setMode(Editor.modes[lang].name);
    });
  }
});
