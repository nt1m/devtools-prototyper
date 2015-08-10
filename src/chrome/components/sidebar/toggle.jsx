let ToggleButton = React.createClass({
  mixins: [Togglable],
  render() {
    return (
      <button id={"toggle-" + this.props.id}
              onClick={this.onClick}
              className={this.state.active ? "active": ""}>
        {this.props.id.toUpperCase()}
      </button>
    )
  },
  onClick() {
    this.toggle();
    app.props.editors.refs[this.props.id].toggle();
  },
  getInitialState() {
    return {active: true};
  }
})
