let Menu = React.createClass({
  render() {
    let cls = "menu " + (this.state.active ? "active" : "") + " " + this.props.className;
    return (
      <div className={cls} id={this.props.id}>
        {this.props.children}
      </div>
    );
  },
  getInitialState() {
    return {active: false};
  }
});
