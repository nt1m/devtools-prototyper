let LibrariesMenu = React.createClass({
  render() {
    let results = this.state.results.map((value, index) => {
      const iconClass = "devtools-icon lib-status-icon";
      return (
        <li className="item">
          <div>
            <span className="item-name">{value.name}</span>
            <span className="item-url">{value.url}</span>
          </div>

          <a className={iconClass + (this.injected ? "checked" : "add")}></a>
        </li>
      );
    });
          // <input type="search" className="devtools-searchinput" ref="search"
          //  placeholder="Find libraries" onInput={this.search} />

    return (
      <Menu ref="menu">
        <div className="devtools-toolbar">
        </div>

        <div ref="results" data-placeholder="&prototyperUI.libs.noneFound;">
          {results}
        </div>
        <div className="separator"></div>
        <div ref="injected" data-placeholder="&prototyperUI.libs.noneInjected;">

        </div>
      </Menu>
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
