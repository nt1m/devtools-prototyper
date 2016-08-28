const LIBRARIES_SEARCH_TIMEOUT = 500;

let LibrariesMenu = React.createClass({
  mixins: [Togglable, Menu],
  render() {
    let results = this.state.results.map((value, index) => {
      return (<LibrariesItem ref={`item-${index}`}
                             key={index} {...value} injected={false}/>);
    });
    let injected = this.state.injected.map(value => {
      return <LibrariesItem {...value} injected={true} />;
    });

    let resultsClassName = this.state.results.length ? "results" : "";
    let menuClassName = this.menuClassName;
    let className = resultsClassName + " " + menuClassName;

    return (
      <div id="libraries-menu" className={className}>
        <div className="devtools-toolbar">
          <input type="search" className="devtools-searchinput" ref="search"
           placeholder={L10N.getStr("prototyper.libs.search")}
           onInput={debounce(this.search, LIBRARIES_SEARCH_TIMEOUT)} />
        </div>

        <b>{L10N.getStr("prototyper.libs.results")}</b>
        <div ref="results" id="libraries-search-results"
          data-placeholder={L10N.getStr("prototyper.libs.noneFound")}>
          {results}
        </div>
        <div className="separator"></div>

        <b>{L10N.getStr("prototyper.libs.injected")}</b>
        <div ref="injected" id="injected-libs"
             data-placeholder={L10N.getStr("prototyper.libs.noneInjected")}>
          {injected}
        </div>
      </div>
    );
  },
  getInitialState() {
    return {
      results: [],
      injected: []
    };
  },
  componentDidMount() {
    let injected = Storage.get("injected-libraries") || [];
    this.setState({injected});
    setTimeout(() => {
      this.setBadge(injected.length);
    }, 1000);
  },
  search() {
    const cdnPrefix = "https://cdnjs.cloudflare.com/ajax/libs/";
    let query = React.findDOMNode(this.refs.search).value.trim();

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
          item.url = item.latest.replace(cdnPrefix, "");
        });
        this.setState({results: response.results});
      }
    });
    xhr.send();
  },
  setBadge(number) {
    let menuButton = app.props.sidebar.refs.libraries;
    menuButton.setState({badge: number});
  },
  save() {
    Storage.set("injected-libraries", this.state.injected);
  }
});
