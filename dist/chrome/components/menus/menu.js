let Menu = React.createClass({
  render() {
    let cls = "menu " + (this.state.active ? "active" : "");
    return React.createElement(
      "div",
      { className: cls },
      this.props.children
    );
  },
  getInitialState() {
    return { active: false };
  }
});
