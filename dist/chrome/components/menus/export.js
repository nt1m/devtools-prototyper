let ExportMenu = React.createClass({
  mixins: [Togglable, Menu],
  render() {
    let items = EXPORT_SERVICES.map(function (item) {
      return React.createElement(ExportItem, item);
    });

    return React.createElement(
      "div",
      { id: "export-menu", className: this.menuClassName },
      React.createElement(
        "p",
        { className: "menu-title" },
        "Export Prototype"
      ),
      items
    );
  }
});

const EXPORT_SERVICES = [{
  id: "local"
}, {
  id: "jsfiddle",
  url: "http://jsfiddle.net/api/post/library/pure/",
  data: {
    html: function () {
      let editor = app.props.editors.refs.html;
      return editor.props.cm.getText().replace(/\n/g, "\n\t\t");
    },
    css: function () {
      let editor = app.props.editors.refs.css;
      return editor.props.cm.getText().replace(/\n/g, "\n\t\t");
    },
    js: function () {
      let editor = app.props.editors.refs.js;
      return editor.props.cm.getText().replace(/\n/g, "\n\t\t");
    }
  },
  submitForm: true
}, {
  id: "codepen",
  url: "http://codepen.io/pen/define",
  data: {
    data: function () {
      let editors = app.props.editors.refs;
      return JSON.stringify({
        description: Settings.get("prototype-description"),
        html: editors.html.props.cm.getText(),
        css: editors.css.props.cm.getText(),
        js: editors.js.props.cm.getText()
      });
    }
  },
  submitForm: true
}, {
  id: "gist-public",
  url: "https://api.github.com/gists",
  data: {
    public: true,
    files: function () {
      let files = {};
      let editors = app.props.editors.refs;

      for (let lang in editors) {
        let name = prototypeName.replace(".html", "." + lang);
        let content = editors[lang].props.cm.getText();
        if (!content) {
          continue;
        }

        files[name] = { content };
      }

      return files;
    },
    description: function () {
      return Settings.get("prototype-description");
    }
  }
}, {
  id: "gist-private",
  url: "https://api.github.com/gists",
  data: {
    public: false,
    files: function () {
      let files = {};
      let editors = app.props.editors.refs;

      for (let lang in editors) {
        let name = prototypeName.replace(".html", "." + lang);
        let content = editors[lang].props.cm.getText();
        if (!content) {
          continue;
        }

        files[name] = { content };
      }

      return files;
    },
    description: function () {
      return Settings.get("prototype-description");
    }
  }
}];
