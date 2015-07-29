let Button = React.createClass({displayName: "Button",
  render() {
    return (
      React.createElement("button", {id: this.props.id, title: this.props.tooltip, 
              onClick: this.props.onClick}, 

        React.createElement("i", {className: "{this.props.icon} devtools-icon"})
      )
    );
  }
});

module.exports = Button;
