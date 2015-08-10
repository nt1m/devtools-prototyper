let LibrariesMenu = React.createClass({
  mixins: [Togglable, Menu],
  render() {
    let results = this.state.results.map((value, index) => {
      return <LibrariesItem ref={`item-${index}`} key={index} {...value} />;
    });
    let injected = this.state.injected.map((value, index) => {
      return <LibrariesItem {...value} injected={true} />;
    });

    let resultsClassName = this.state.results.length ? "results" : "";
    let menuClassName = this.menuClassName;
    let className = resultsClassName + " " + menuClassName;

    return (
      <div id="libraries-menu" className={className}>
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
      </div>
    );
  },
  getInitialState() {
    return {
      results: [],
      injected: []
    }
  },
  search() {
    const cdn = "https://cdnjs.cloudflare.com/ajax/libs/";
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
        response.results.map(item => {
          item.url = item.latest.replace(cdn, "");
        });
        response.results = response.results.reverse();
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
