let Sidebar = React.createClass({
  getInitialState() {
    return {
      selectedButtons: null
    };
  },
  render() {
    let buttons = this.props.buttons.map((value, index) => {
      return (
        <Button key={index} {...value} />
      );
    });
    return <div className="sidebar">{buttons}</div>;
  }
});
