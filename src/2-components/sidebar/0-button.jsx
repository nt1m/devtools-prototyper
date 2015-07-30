let Button = React.createClass({
  render() {
    return (
      <button id={this.props.id} title={this.props.tooltip}
              onClick={this.props.onClick}>

        <i className="{this.props.icon} devtools-icon"></i>
      </button>
    );
  }
});
