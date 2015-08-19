let SettingsItem = React.createClass({
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
      props.defaultChecked = value === "true";
    } else {
      props.value = value;
    }

    let input = props.type === "textarea" ? <textarea {...props} />
                                          : <input {...props} />;

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

    Settings.set(this.props.id, value);
    app.props.settings.update();
  }
});
