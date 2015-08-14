let App = React.createClass({
  getInitialState() {
    return {};
  },
  render() {

    return (
      <div className="container">
        <Sidebar ref="sidebar" />
        <LibrariesMenu ref="libraries" />
        <ExportMenu ref="export" />
        <Editors ref="editors" />
        <SettingsPanel ref="settings" />
      </div>
    );
  },
  componentDidMount() {
    this.props.sidebar = this.refs.sidebar;
    this.props.libraries = this.refs.libraries;
    this.props.editors = this.refs.editors;
    this.props.settings = this.refs.settings;
    this.props.export = this.refs.export;
  }
});
