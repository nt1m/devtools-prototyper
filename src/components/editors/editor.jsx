let Editor = React.createClass({
  render() {
    return (
      <div className="devtools-main-content"
        data-lang={this.props.lang}
        id="{this.props.lang}-editor">
      </div>
    );
  },
  componentDidMount() {
    // Setup the editor stuff in here.
  }
});

module.exports = Editor;
