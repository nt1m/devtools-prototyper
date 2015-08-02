let Editors = React.createClass({displayName: "Editors",
  render() {
    return (
      React.createElement("div", {className: "devtools-container"}, 
        React.createElement(Editor, {lang: "html", ref: "html"}), 
        React.createElement(Editor, {lang: "css", ref: "css"}), 
        React.createElement(Editor, {lang: "js", ref: "js"})
      )
		);
  }
});
