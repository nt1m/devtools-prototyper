let SettingsItem = React.createClass({
  getDefaultProps() {
    return {synced: true};
  },
  render() {
    let settings = app.props.settings;
    const value = app.props.settings ? settings.state.settings[this.props.id]
                                     : "";
    this.isToggle = ["checkbox", "radio"].indexOf(this.props.type) > -1;

    const props = {
      ref: "input",
      id: this.props.id,
      type: this.props.type,
      onChange: this.onChange
    };

    if (this.isToggle) {
      props.defaultChecked = props.checked = value;
    } else {
      props.value = value;
    }

    let input = props.type === "textarea" ? <textarea {...props} />
                                          : <input {...props} />;

    if (props.type == "text" || props.type == "textarea") {
      input.props.className = "devtools-textinput";
    }

    return <div className={"setting " + (this.isToggle ? "single" : "")}>
        {input}
        <label htmlFor={this.props.id}>{L10N.getStr(this.props.label)}</label>
    </div>;
  },
  onChange() {
    let input = React.findDOMNode(this.refs.input);
    let value = input.value;
    if (this.isToggle) {
      value = input.checked;
    }

    Settings.set(this.props.id, value, this.props.synced);
    app.props.settings.update();

    if (this.props.id == "sync-enabled") {
      Settings.refreshSyncState();
    }
  }
});
