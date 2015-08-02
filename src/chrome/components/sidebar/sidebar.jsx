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
    let toggles = switches.map((value, index) => {
      return (
        <ToggleButton key={btns.length + index} {...value} />
      );
    })
    return <div id="sidebar">
      {btns}
      <i className="spacer"></i>
      {toggles}
    </div>;
  }
});
