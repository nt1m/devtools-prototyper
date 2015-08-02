let App = React.createClass({displayName: "App",
  getInitialState() {
    return {};
  },
  render() {

    return (
      React.createElement("div", {className: "container"}, 
        React.createElement(Sidebar, {ref: "sidebar"}), 
        React.createElement(LibrariesMenu, {ref: "libraries"}), 
        React.createElement(Editors, {ref: "editors"})
      )
    );
  },
  componentDidMount() {
    this.props.sidebar = this.refs.sidebar;
    this.props.libraries = this.refs.libraries;
    this.props.editors = this.refs.editors;
  }
});
