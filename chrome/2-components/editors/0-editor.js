let Editor = React.createClass({displayName: "Editor",
  render() {
    return (
      React.createElement("div", {className: "devtools-main-content", 
        "data-lang": this.props.lang, 
        id: "{this.props.lang}-editor"}
      )
    );
  },
  componentDidMount() {
    // Setup the editor stuff in here.
  }
});
