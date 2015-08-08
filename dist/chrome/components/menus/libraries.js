var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let LibrariesMenu = React.createClass({
  render() {
    let results = this.state.results.map(function (value, index) {
      return React.createElement(LibrariesItem, _extends({ key: index }, value));
    });
    let injected = this.state.injected.map(function (value, index) {
      return React.createElement(LibrariesItem, _extends({}, value, { injected: true }));
    });

    return React.createElement(
      Menu,
      { ref: "menu", className: this.state.results.length ? "results" : "" },
      React.createElement(
        "div",
        { className: "devtools-toolbar" },
        React.createElement("input", { type: "search", className: "devtools-searchinput", ref: "search",
          placeholder: "Find libraries", onInput: this.search })
      ),
      React.createElement(
        "div",
        { ref: "results", "data-placeholder": "&prototyperUI.libs.noneFound;" },
        results
      ),
      React.createElement("div", { className: "separator" }),
      React.createElement(
        "div",
        { ref: "injected", "data-placeholder": "&prototyperUI.libs.noneInjected;" },
        injected
      )
    );
  },
  getInitialState() {
    return {
      results: [],
      injected: []
    };
  },
  search() {
    let query = React.findDOMNode(this.refs.search).value.trim();
    let results = React.findDOMNode(this.refs.results);
    let injected = React.findDOMNode(this.refs.injected);

    if (!query) {
      this.updateStates([]);
      return;
    }

    this.updateStates([{ name: "jquery", url: "jquery.com" }]);

    // let URL = "http://api.cdnjs.com/libraries?search=" + query;
    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", URL);
    // xhr.addEventListener("readystatechange", () => {
    //   if (xhr.readyState == 4) {
    //     let response = JSON.parse(xhr.responseText);
    //     console.log(response);
    //     response.query = query;
    //   }
    // });
    // xhr.send();
  },
  updateStates(results = []) {
    this.setState({ results });
    let menuButton = app.props.sidebar.refs.libraries;
    menuButton.setState({ badge: results.length });
  }
});
