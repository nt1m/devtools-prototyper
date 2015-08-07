let SidebarButton = React.createClass({
  render() {
    return (
      <button id={this.props.id + "-button"} title={this.props.tooltip}
              onClick={this.onClick}
              className={this.state.active ? "active" : ""}>

        <i className={this.props.id + " devtools-icon"}></i>
      </button>
    );
  },
  getInitialState() {
    return {active: false};
  },
  onClick(e) {
    if (this.props.onClick) this.props.onClick.call(this, e);
  }
});
