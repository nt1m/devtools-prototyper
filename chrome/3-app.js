let App = React.createClass({displayName: "App",
  getInitialState() {
    return {};
  },
  render() {
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Hi"), 
        React.createElement("div", {className: "devtools-container"}, 
          "Hey, wassup bro"
        )
      )
    );
  }
});
