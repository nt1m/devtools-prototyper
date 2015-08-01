const buttons = [
  {
    id: "run",
    onClick: Code.run
  },
  {
    id: "beautify"
  },
  {
    id: "export"
  },
  {
    id: "libraries"
  },
  {
    id: "settings"
  }
];

let Sidebar = React.createClass({
  getInitialState() {
    return {
      selectedButtons: null
    };
  },
  render() {
    let btns = buttons.map((value, index) => {
      return (
        <SidebarButton key={index} {...value} />
      );
    });
    return <div id="sidebar">{btns}</div>;
  }
});
