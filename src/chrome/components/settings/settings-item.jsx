let SettingsItem = React.createClass({
  render() {
    const value = app.props.settings ? app.props.settings.state.settings[this.props.id] : "";
    const isToggle = this.isToggle = ["checkbox", "radio"].indexOf(this.props.type) > -1;

    const props = {
      ref: "input",
      id: this.props.id,
      type: this.props.type,
      onChange: this.onChange
    };

    if (isToggle) {
      props.checked = value === "true";
    } else {
      props.value = value;
    }

    let input = props.type === "textarea" ? <textarea {...props} />
                                          : <input {...props} />

    return <div className={"setting " + (isToggle ? "single" : "")}>
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
})
