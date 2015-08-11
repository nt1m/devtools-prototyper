let SettingsItem = React.createClass({
  render() {
    const value = app.props.settings ? app.props.settings.state.settings[this.props.id] : "";
    const isToggle = this.props.isToggle = ["checkbox", "radio"].indexOf(this.props.type) > -1;

    let input = this.props.type === "textarea" ? <textarea /> : <input type={this.props.type} />

    input.props.value = value;
    input.props.id = this.props.id;
    input.ref = "input";

    if (isToggle) {
      input.props.onClick = this.onChange;
      input.props.checked = (value === "true");
    } else {
      input.props.onInput = this.onChange;
    }

    return <div className={"setting " + (isToggle ? "single" : "")}>
        {input}
        <label for={this.props.id}>{L10N.getStr(this.props.label)}</label>
    </div>;
  },
  onChange() {
    let input = React.findDOMNode(this.refs.input);
    let value = input.value;
    if (this.props.isToggle) {
      value = input.checked;
    }

    Settings.set(this.props.id, value);
    app.props.settings.update();
  }
})
