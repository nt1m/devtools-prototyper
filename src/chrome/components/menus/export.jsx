let ExportMenu = React.createClass({
  mixins: [Togglable, Menu],
  render() {
    let items = EXPORT_SERVICES.map(item => <ExportItem {...item} />);

    return (
      <div id="export-menu" className={this.menuClassName}>
        {items}
      </div>
    );
  }
});

const EXPORT_SERVICES = [
  {
    id: "local"
  },
  {
    id: "jsfiddle",
    url: "http://jsfiddle.net/api/post/library/pure/",
    data: {
      html: () => editors.html.props.cm.getText().replace(/\n/g, "\n\t\t"),
      css: () => editors.css.props.cm.getText().replace(/\n/g, "\n\t\t"),
      js: () => editors.js.props.cm.getText().replace(/\n/g, "\n\t\t")
    },
    submitForm: true
  },
  {
    id: "codepen",
    url: "http://codepen.io/pen/define",
    data: {
      data: () => {
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
  },
  {
    id: "gist",
    url: "https://api.github.com/gists",
    data: {
      public: !!Settings.get("gist-public"),
      files: () => {
        let files = {};
        let editors = app.props.editors.refs;

        for (let lang in editors) {
          let name = prototypeName.replace(".html", "." + lang);
          let content = editors[lang].props.cm.getText();
          if (!content) {
            continue;
          }

          files[name] = {content};
        }

        return files;
      },
      description: () => Settings.get("prototype-description")
    }
  }
];
