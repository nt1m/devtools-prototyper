var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let buttons, switches;

let Sidebar = React.createClass({
  getInitialState() {
    return {
      selectedButtons: null
    };
  },
  componentWillMount() {
    buttons = [{
      id: "run",
      onClick: Code.run
    }, {
      id: "beautify",
      onClick: Code.beautify
    }, {
      id: "export"
    }, {
      id: "libraries",
      onClick() {
        this.toggle();
        app.props.libraries.toggle();
      }
    }, {
      id: "settings",
      onClick() {
        this.toggle();
        app.props.settings.toggle();
      }
    }];

    switches = [{
      id: "html"
    }, {
      id: "css"
    }, {
      id: "js"
    }];
  },
  render() {
    let btns = buttons.map(function (value, index) {
      return React.createElement(SidebarButton, _extends({ ref: value.id, key: index }, value));
    });
    let toggles = switches.map(function (value, index) {
      return React.createElement(ToggleButton, _extends({ ref: value.id, key: btns.length + index }, value));
    });
    return React.createElement(
      "div",
      { id: "sidebar" },
      btns,
      React.createElement("i", { className: "spacer" }),
      toggles
    );
  }
});
