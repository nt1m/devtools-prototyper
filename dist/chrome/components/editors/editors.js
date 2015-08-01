let Editors = React.createClass({displayName: "Editors",
  render() {
    this.props.html = React.createElement(Editor, {lang: "html", ref: "html"});
    this.props.css = React.createElement(Editor, {lang: "css", ref: "css"});
    this.props.js = React.createElement(Editor, {lang: "js", ref: "js"});

    return (
      React.createElement("div", {className: "devtools-container"}, 
        this.props.html, 
        this.props.css, 
        this.props.js
      )
		);
  }
});
