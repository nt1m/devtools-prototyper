let SidebarButton = React.createClass({
  render() {
    return (
      <button id={this.props.id + "-button"} title={this.props.tooltip}
              onClick={this.props.onClick}>

        <i className={this.props.id + " devtools-icon"}></i>
      </button>
    );
  }
});
