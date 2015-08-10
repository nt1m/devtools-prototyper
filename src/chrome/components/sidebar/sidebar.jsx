let buttons, switches;

let Sidebar = React.createClass({
  getInitialState() {
    return {
      selectedButtons: null
    };
  },
  componentWillMount() {
    buttons = [
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
          this.toggle();
          app.props.libraries.toggle();
        }
      },
      {
        id: "settings",
        onClick() {
          this.toggle();
          app.props.settings.toggle();
        }
      }
    ];

    switches = [
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
  },
  render() {
    let btns = buttons.map((value, index) => {
      return (
        <SidebarButton ref={value.id} key={index} {...value} />
      );
    });
    let toggles = switches.map((value, index) => {
      return (
        <ToggleButton ref={value.id} key={btns.length + index} {...value} />
      );
    })
    return <div id="sidebar">
      {btns}
      <i className="spacer"></i>
      {toggles}
    </div>;
  }
});
