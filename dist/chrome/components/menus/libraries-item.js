let LibrariesItem = React.createClass({
  render() {
    const iconClass = "devtools-icon ";
    const injected = this;
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
          this.props.latest
        )
      ),
      React.createElement("a", { onClick: this.onStatusIconClick,
        className: iconClass + statusClass })
    );
  },
  getInitialState() {
    return { injected: this.props.injected ? true : false };
  },
  onStatusIconClick() {
    let injected = !this.state.injected;

    this.updateStates(injected);
  },
  // Updates the states of the component itself and related components.
  // Keeps injected and search results in sync
  updateStates(state) {
    var _this = this;

    this.setState({ injected: state });

    let libraries = app.props.libraries;
    let injected = libraries.state.injected;
    let results = libraries.state.results;

    if (state) {
      injected.push(this.props);
    } else {
      injected.splice(injected.indexOf(this.props), 1);

      if (this.props.injected) {
        let matched = results.findIndex(function (item) {
          return item.name === _this.props.name;
        });
        let component = libraries.refs[`item-${ matched }`].updateStates(false);
      }
    }

    libraries.setState({ injected, results });
    libraries.setBadge(injected.length);
  }
});
