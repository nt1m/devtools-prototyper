let LibrariesItem = React.createClass({
  render() {
    const iconClass = "devtools-icon lib-status-icon ";
    console.log(this.props, this.state);
    const statusClass = this.props.injected ? "remove" : this.state.injected ? "checked" : "add";

    return React.createElement(
      "li",
      { className: "item" },
      React.createElement(
        "div",
        null,
        React.createElement(
          "span",
          { className: "item-name" },
          this.props.name
        ),
        React.createElement(
          "span",
          { className: "item-url" },
          this.props.url
        )
      ),
      React.createElement("a", { onClick: this.onClick,
        className: iconClass + statusClass })
    );
  },
  getInitialState() {
    return { injected: false };
  },
  onClick() {
    let injected = !this.state.injected;

    this.updateStates(injected);
  },
  updateStates(state) {
    this.setState({ injected: state });

    let libraries = app.props.libraries;
    let injected = libraries.state.injected;
    let results = libraries.state.results;

    if (state) {
      injected.push(this.props);
    } else {
      injected.splice(injected.indexOf(this.props), 1);
    }

    libraries.setState({ injected, results });
  }
});
