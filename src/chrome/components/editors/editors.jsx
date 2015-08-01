let Editors = React.createClass({
  render() {
    this.props.html = <Editor lang="html" ref="html" />;
    this.props.css = <Editor lang="css" ref="css" />;
    this.props.js = <Editor lang="js" ref="js" />;

    return (
      <div className="devtools-container">
        {this.props.html}
        {this.props.css}
        {this.props.js}
      </div>
		);
  }
});
