let Overlay = React.createClass({
  render() {
    let className = "overlay " + (this.state.active ? "active" : "");
    return <div className={className} id={this.props.id}>
      {this.props.children}
    </div>;
  },
  getInitialState() {
    return {active: false};
  }
})
