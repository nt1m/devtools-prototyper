let Button = require("./button");

let Sidebar = React.createClass({displayName: "Sidebar",
  getInitialState() {
    return {
      selectedButtons: null
    };
  },
  render() {
    let buttons = this.props.buttons.map((value, index) => {
      return (
        React.createElement(Button, React.__spread({key: index},  value))
      );
    });
    return React.createElement("div", {className: "sidebar"}, buttons);
  }
});

module.exports = Sidebar;
