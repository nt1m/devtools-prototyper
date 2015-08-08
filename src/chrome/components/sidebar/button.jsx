let SidebarButton = React.createClass({
  render() {
    let badge = null;
    if (this.state.badge) {
      badge = <span className="badge" ref="badge">
        {this.state.badge}
      </span>
    }

    return (
      <button id={this.props.id + "-button"} title={this.props.tooltip}
              onClick={this.onClick}
              className={this.state.active ? "active" : ""}>
        {badge}
        <i className={this.props.id + " devtools-icon"}></i>
      </button>
    );
  },
  getInitialState() {
    return {active: false, badge: null};
  },
  onClick(e) {
    if (this.props.onClick) this.props.onClick.call(this, e);
  }
});
