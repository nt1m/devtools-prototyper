let App = React.createClass({
  getInitialState() {
    return {};
  },
  render() {

    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(Sidebar, { ref: "sidebar" }),
      React.createElement(LibrariesMenu, { ref: "libraries" }),
      React.createElement(Editors, { ref: "editors" }),
      React.createElement(SettingsPanel, { ref: "settings" })
    );
  },
  componentDidMount() {
    this.props.sidebar = this.refs.sidebar;
    this.props.libraries = this.refs.libraries;
    this.props.editors = this.refs.editors;
    this.props.settings = this.refs.settings;
  }
});
