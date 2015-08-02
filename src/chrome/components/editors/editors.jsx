let Editors = React.createClass({
  render() {
    return (
      <div className="devtools-container">
        <Editor lang="html" ref="html" />
        <Editor lang="css" ref="css" />
        <Editor lang="js" ref="js" />
      </div>
		);
  }
});
