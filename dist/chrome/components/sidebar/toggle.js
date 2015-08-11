let ToggleButton = React.createClass({
  mixins: [Togglable],
  render() {
    return React.createElement(
      "button",
      { id: "toggle-" + this.props.id,
        onClick: this.onClick,
        className: this.state.active ? "active" : "" },
      this.props.id.toUpperCase()
    );
  },
  onClick() {
    this.toggle();
    app.props.editors.refs[this.props.id].toggle();
  },
  getInitialState() {
    return { active: true };
  }
});
