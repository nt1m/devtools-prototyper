let Menu = React.createClass({displayName: "Menu",
  render() {
    let cls = "devtools-menu " + (this.state.active ? "active" : "");
    return (
      React.createElement("div", {className: cls}, 
        this.props.children
      )
    );
  },
  getInitialState() {
    return {active: false};
  }
});
