let SettingsPanel = React.createClass({
  mixins: [Togglable, Overlay],
  render() {
    return <div className={this.overlayClassName} id="settings">
      <form onSubmit={this.onSubmit}>
        <div className="column">
          <h1 className="title">
            {L10N.getStr("prototyper.prototypeSettings")}
          </h1>
          <SettingsItem id="prototype-title" type="text"
                        label="prototyper.prototypeSettings.title" />
          <SettingsItem id="prototype-description" type="textarea"
                        label="prototyper.prototypeSettings.description" />
        </div>
        <div className="column">
          <h1 className="title">
            {L10N.getStr("prototyper.settings")}
          </h1>
          <SettingsItem id="emmet-enabled" type="checkbox"
                        label="prototyper.settings.enableEmmet"/>
          <SettingsItem id="sync-enabled" type="checkbox"
                        label="prototyper.settings.enableSync" synced={false}/>
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

    let editors = app.props.editors.refs;
    let emmet = Settings.get("emmet-enabled");

    for (let editor in editors) {
      editors[editor].updateEmmet(emmet);
    }
  }
});
