let SidebarButton = React.createClass({
  mixins: [Togglable],
  render() {
    let badge = null;
    if (this.state.badge) {
      badge = (<span className="badge" ref="badge">
        {this.state.badge}
      </span>);
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
    // Call event listeners defined as property with the proper context
    // e.g. <Button onClick={someFunction} /> is passed as `props.onClick`
    if (this.props.onClick) {
      this.props.onClick.call(this, e);
    }
  }
});
