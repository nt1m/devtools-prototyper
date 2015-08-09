var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const buttons = [{
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
    let menu = app.props.libraries.refs.menu;
    menu.setState({ active: !menu.state.active });

    let active = !this.state.active;
    this.setState({ active });
  }
}, {
  id: "settings",
  onClick() {
    let settings = app.props.settings;
    settings.toggle();

    let active = !this.state.active;
    this.setState({ active });
  }
}];

const switches = [{
  id: "html"
}, {
  id: "css"
}, {
  id: "js"
}];

let Sidebar = React.createClass({
  getInitialState() {
    return {
      selectedButtons: null
    };
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
