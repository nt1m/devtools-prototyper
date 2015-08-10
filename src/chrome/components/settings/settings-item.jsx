let SettingsItem = React.createClass({
  render() {
    const value = app.props.settings ? app.props.settings.state.settings[this.props.id] : "";
    const single = this.props.single = ["checkbox", "radio"].includes(this.props.type);

    let input = this.props.type === "textarea" ? <textarea /> : <input type={this.props.type} />

    input.props.value = value;
    input.props.id = this.props.id;
    input.ref = "input";

    if (single) {
      input.props.onClick = this.onChange;
    } else {
      input.props.onInput = this.onChange;
    }

    if (single) input.props.checked = value === "true" ? true : false;

    return <div className={"setting " + (single ? "single" : "")}>
        {input}
        <label for={this.props.id}>{L10N.getStr(this.props.label)}</label>
    </div>;
  },
  onChange() {
    let input = React.findDOMNode(this.refs.input);
    let value = input.value;
    if (this.props.single) {
      value = input.checked;
    }

    Settings.set(this.props.id, value);
    app.props.settings.update();
  }
})
