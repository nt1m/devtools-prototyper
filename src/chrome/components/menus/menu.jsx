let Menu = React.createClass({
  render() {
    let cls = "menu " + (this.state.active ? "active" : "");
    return (
      <div className={cls}>
        {this.props.children}
      </div>
    );
  },
  getInitialState() {
    return {active: false};
  }
});
