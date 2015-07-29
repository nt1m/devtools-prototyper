let app = React.createClass({displayName: "app",
  getInitialState() {
    return {};
  },
  render() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "devtools-container"}, 
          "Hey, wassup bro"
        )
      )
    );
  }
});

module.exports = app;
