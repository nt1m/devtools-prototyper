let LibrariesMenu = React.createClass({
  render() {
    let results = this.state.results.map((value, index) => {
      return <LibrariesItem ref={`item-${index}`} key={index} {...value} />;
    });
    let injected = this.state.injected.map((value, index) => {
      return <LibrariesItem {...value} injected={true} />;
    });

    return (
      <Menu ref="menu" id="libraries-menu" className={this.state.results.length ? "results" : ""}>
        <div className="devtools-toolbar">
          <input type="search" className="devtools-searchinput" ref="search"
           placeholder={L10N.getStr("prototyper.libs.search")} onInput={this.search} />
        </div>

        <b>{L10N.getStr("prototyper.libs.results")}</b>
        <div ref="results" id="libraries-search-results"
          data-placeholder={L10N.getStr("prototyper.libs.noneFound")}>
          {results}
        </div>
        <div className="separator"></div>

        <b>{L10N.getStr("prototyper.libs.injected")}</b>
        <div ref="injected" id="injected-libs" data-placeholder={L10N.getStr("prototyper.libs.noneInjected")}>
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
      this.setState({results: []});
      return;
    }

    let URL = "http://api.cdnjs.com/libraries?search=" + query;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL);
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.responseText);
        this.setState({results: response.results});
      }
    });
    xhr.send();
  },
  setBadge(number) {
    let menuButton = app.props.sidebar.refs.libraries;
    menuButton.setState({badge: number});
  }
});
