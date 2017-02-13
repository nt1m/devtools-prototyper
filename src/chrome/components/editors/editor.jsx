let CodeMirror = require("devtools/client/sourceeditor/editor");
const EMMET_URL = `${basePath}/content/lib/emmet.min.js`;
const IS_MAC = navigator.platform.toLowerCase().includes("mac");
const SELECTOR_HIGHLIGHT_TIMEOUT = 500;

let Editor = React.createClass({
  mixins: [Togglable],
  render() {
    let classes = ["devtools-main-content"]

    if (!this.state.active) {
      classes.push("hidden");
    }
    return (
      <div className={classes.join(" ")}
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

    const CtrlOrCmd = IS_MAC ? "Cmd" : "Ctrl";
    const config = {
      lineNumbers: true,
      readOnly: false,
      autoCloseBrackets: "{}()[]",
      extraKeys: {
        [`${CtrlOrCmd}-Enter`]: Code.run,
        [`${CtrlOrCmd}-R`]: Code.run,
        [`${CtrlOrCmd}-S`]: openExportMenu,
        "Esc": false
      }
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
        if (lang === "css" && this.previewer) {
          this.previewer.destroy();
        }
      });
      sourceEditor.setMode(CodeMirror.modes[lang].name);
      if (!toolbox || lang !== "css") {
        return;
      }
      let hUtils = toolbox.highlighterUtils;
      if (hUtils.supportsCustomHighlighters()) {
        try {
          hUtils.getHighlighterByType("SelectorHighlighter").then((highlighter) => {
            this.highlighter = highlighter;
            if (this.highlighter && toolbox.walker) {
              sourceEditor.container.addEventListener("mousemove", this._onMouseMove);
            }
          });
        } catch (e) {
          // The selectorHighlighter can't always be instantiated, for example
          // it doesn't work with XUL windows (until bug 1094959 gets fixed);
          // or the selectorHighlighter doesn't exist on the backend.
          console.warn("The selectorHighlighter couldn't be instantiated, " +
            "elements matching hovered selectors will not be highlighted");
        }
      }
    });
  },

  _onMouseMove(e) {
    this.highlighter.hide();

    if (this.previewer) {
      this.previewer.destroy();
      this.previewer = undefined;
    }

    if (this.mouseMoveTimeout) {
      window.clearTimeout(this.mouseMoveTimeout);
      this.mouseMoveTimeout = null;
    }

    this.mouseMoveTimeout = window.setTimeout(() => {
      this._highlightItemAt(e.clientX, e.clientY);
    }, SELECTOR_HIGHLIGHT_TIMEOUT);
  },

  _highlightItemAt(x, y) {
    const CSSCompleter =
      require("devtools/client/sourceeditor/css-autocompleter");
    let completer = new CSSCompleter();
    let pos = this.props.cm.getPositionFromCoords({left: x, top: y});
    let info = completer.getInfoAt(this.props.cm.getText(), pos);

    if (!info) {
      return;
    }

    switch (info.state) {
      case "selector":
        if (info.selector) {
          this._highlightSelector(info.selector);
        }
        break;
      case "value":
        if (info.propertyName && info.value &&
           Previewer.isAvailable(info.propertyName, info.value)) {
          if (this.refs.container.getDOMNode().offsetLeft) {
            x += this.refs.container.getDOMNode().offsetLeft;
          }
          this._createPreviewer(info, x, y);
        }
        break;
    }
  },

  _createPreviewer(info, x, y) {
    // info.loc.end/start.{ch/line}
    this.previewer = new Previewer(info.propertyName, info.value, {x, y});
  },

  _highlightSelector(selector) {
    toolbox.walker.querySelector(toolbox.walker.rootNode, "body").then((node) => {
      toolbox.walker.querySelectorAll(toolbox.walker.rootNode, selector).then((nodes) => {
        let params = {
          selector,
          hideInfoBar: nodes.length > 1,
        };
        if (nodes.length > 1) {
          params.showOnly = params.region = "border";
        }
        this.highlighter.show(node, params);
      });
    });
  },
});
