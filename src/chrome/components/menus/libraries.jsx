let LibrariesMenu = React.createClass({
  render() {
    let results = this.state.results.map((value, index) => {
      return <LibrariesItem key={index} {...value} />;
    });
    let injected = this.state.injected.map((value, index) => {
      return <LibrariesItem {...value} injected={true} />;
    });

    return (
      <Menu ref="menu" className={this.state.results.length ? "results" : ""}>
        <div className="devtools-toolbar">
          <input type="search" className="devtools-searchinput" ref="search"
           placeholder="Find libraries" onInput={this.search} />
        </div>

        <div ref="results" data-placeholder="&prototyperUI.libs.noneFound;">
          {results}
        </div>
        <div className="separator"></div>
        <div ref="injected" data-placeholder="&prototyperUI.libs.noneInjected;">
          {injected}
        </div>
      </Menu>
    );
  },
  getInitialState() {
    return {
      results: [],
      injected: []
    }
  },
  search() {
    let query = React.findDOMNode(this.refs.search).value.trim();
    let results = React.findDOMNode(this.refs.results);
    let injected = React.findDOMNode(this.refs.injected);

    if (!query) {
      this.updateStates([]);
      return;
    }

    this.updateStates([{name: "jquery", url: "jquery.com"}]);

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
    this.setState({results});
    let menuButton = app.props.sidebar.refs.libraries;
    menuButton.setState({badge: results.length});
  }
});
