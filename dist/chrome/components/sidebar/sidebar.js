const buttons = [
  {
    id: "run",
    onClick: Code.run
  },
  {
    id: "beautify",
    onClick: Code.beautify
  },
  {
    id: "export"
  },
  {
    id: "libraries",
    onClick() {
      let menu = app.props.libraries.refs.menu;
      menu.setState({active: !menu.state.active});
    }
  },
  {
    id: "settings"
  }
];

const switches = [
  {
    id: "html"
  },
  {
    id: "css"
  },
  {
    id: "js"
  }
]

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
    let toggles = switches.map((value, index) => {
      return (
        React.createElement(ToggleButton, React.__spread({key: btns.length + index},  value))
      );
    })
    return React.createElement("div", {id: "sidebar"}, 
      btns, 
      React.createElement("i", {className: "spacer"}), 
      toggles
    );
  }
});
