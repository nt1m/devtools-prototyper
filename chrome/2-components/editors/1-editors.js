let Editors = React.createClass({displayName: "Editors",
  render() {
    return (
      React.createElement("div", null, 
        React.createElement(Editor, {lang: "html"}), 
        React.createElement(Editor, {lang: "css"}), 
        React.createElement(Editor, {lang: "js"})
      )
		);
  }
});
