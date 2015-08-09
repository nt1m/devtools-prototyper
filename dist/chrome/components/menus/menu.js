let Menu = React.createClass({
  render() {
    let cls = "menu " + (this.state.active ? "active" : "") + " " + this.props.className;
    return React.createElement(
      "div",
      { className: cls, id: this.props.id },
      this.props.children
    );
  },
  getInitialState() {
    return { active: false };
  }
});
