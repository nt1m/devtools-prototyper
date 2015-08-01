let App = React.createClass({displayName: "App",
  getInitialState() {
    return {};
  },
  render() {
    this.props.sidebar = React.createElement(Sidebar, {ref: "sidebar"});
    this.props.editors = React.createElement(Editors, {ref: "editors"});
    
    return (
      React.createElement("div", {className: "container"}, 
        this.props.sidebar, 
        this.props.editors
      )
    );
  }
});
