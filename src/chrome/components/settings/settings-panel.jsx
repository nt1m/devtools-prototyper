let SettingsPanel = React.createClass({
  mixins: [Togglable, Overlay],
  render() {
    return <div className={this.overlayClassName} id="settings">
      <form onSubmit={this.onSubmit}>
        <div className="column">
          <h1 className="title">{L10N.getStr("prototyper.prototypeSettings")}</h1>
          <SettingsItem id="prototype-title" type="text" label="prototyper.prototypeSettings.title" />
          <SettingsItem id="prototype-description" type="textarea" label="prototyper.prototypeSettings.description" />
          <SettingsItem id="gist-public" type="checkbox" label="prototyper.prototypeSettings.gistPublic" />
        </div>
        <div className="column">
          <h1 className="title">{L10N.getStr("prototyper.settings")}</h1>
          <SettingsItem id="emmet-enabled" type="checkbox" label="prototyper.settings.enableEmmet" />
        </div>
      </form>
    </div>;
  },
  onSubmit(e) {
    e.preventDefault();
  },
  getInitialState() {
    return {settings: Settings.object()};
  },
  update() {
    this.setState({settings: Settings.object()});
  }
});
