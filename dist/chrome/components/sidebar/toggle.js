let ToggleButton = React.createClass({
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
    const active = !this.state.active;
    this.setState({ active });

    const editors = app.props.editors.refs;
    editors[this.props.id].setState({ active });
  },
  getInitialState() {
    return { active: true };
  }
});
