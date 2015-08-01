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

let Sidebar = React.createClass({displayName: "Sidebar",
  getInitialState() {
    return {
      selectedButtons: null
    };
  },
  render() {
    let btns = buttons.map((value, index) => {
      return (
        React.createElement(SidebarButton, React.__spread({key: index},  value))
      );
    });
    return React.createElement("div", {id: "sidebar"}, btns);
  }
});
