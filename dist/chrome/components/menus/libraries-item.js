let LibrariesItem = React.createClass({
  render() {
    const iconClass = "devtools-icon lib-status-icon";
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
      React.createElement("a", { className: iconClass + (this.state.injected ? "checked" : "add") })
    );
  }
});
