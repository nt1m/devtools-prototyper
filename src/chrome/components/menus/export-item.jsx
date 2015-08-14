let ExportItem = React.createClass({
  render() {
    return (
      <a onClick={this.onClick}>
        {L10N.getStr(`prototyper.export.${this.props.id}.label`)}
      </a>
    );
  },
  onClick() {
    Code.exportCode(this.props.id);
  }
})
