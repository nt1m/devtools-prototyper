let App = React.createClass({
  getInitialState() {
    return {};
  },
  render() {
    this.props.sidebar = <Sidebar ref="sidebar" />;
    this.props.editors = <Editors ref="editors" />;
    
    return (
      <div className="container">
        {this.props.sidebar}
        {this.props.editors}
      </div>
    );
  }
});
