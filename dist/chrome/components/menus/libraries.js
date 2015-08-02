let LibrariesMenu = React.createClass({displayName: "LibrariesMenu",
  render() {
    let results = this.state.results.map((value, index) => {
      const iconClass = "devtools-icon lib-status-icon";
      return (
        React.createElement("li", {className: "item"}, 
          React.createElement("div", null, 
            React.createElement("span", {className: "item-name"}, value.name), 
            React.createElement("span", {className: "item-url"}, value.url)
          ), 

          React.createElement("a", {className: iconClass + (this.injected ? "checked" : "add")})
        )
      );
    });
          // <input type="search" className="devtools-searchinput" ref="search"
          //  placeholder="Find libraries" onInput={this.search} />

    return (
      React.createElement(Menu, {ref: "menu"}, 
        React.createElement("div", {className: "devtools-toolbar"}
        ), 

        React.createElement("div", {ref: "results", "data-placeholder": "&prototyperUI.libs.noneFound;"}, 
          results
        ), 
        React.createElement("div", {className: "separator"}), 
        React.createElement("div", {ref: "injected", "data-placeholder": "&prototyperUI.libs.noneInjected;"}

        )
      )
    );
  },
  getInitialState() {
    return {
      results: []
    }
  },
  search() {
    let query = React.findDOMNode(this.refs.search).value.trim();
    let container = React.findDOMNode(this.refs.container);
    let results = React.findDOMNode(this.refs.results);
    let injected = React.findDOMNode(this.refs.injected);

    if (!query) {
      container.classList.remove("results");
      return;
    }
    container.classList.add("results");

    results.textContent = "";

    let URL = "http://api.cdnjs.com/libraries?search=" + query;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL);
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.responseText);
        console.log(response);
        response.query = query;
        this.displayResults(response);
      }
    });
    xhr.send();
  },

});
