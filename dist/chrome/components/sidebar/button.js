let SidebarButton = React.createClass({displayName: "SidebarButton",
  render() {
    return (
      React.createElement("button", {id: this.props.id + "-button", title: this.props.tooltip, 
              onClick: this.props.onClick}, 

        React.createElement("i", {className: this.props.id + " devtools-icon"})
      )
    );
  }
});
