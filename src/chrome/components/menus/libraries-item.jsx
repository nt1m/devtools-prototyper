let LibrariesItem = React.createClass({
  render() {
    const iconClass = "devtools-icon ";
    const injected = this;
    const statusClass = (this.state.injected || this.props.injected) ? "remove"
                                                                      : "add";

    return (
      <li className="item">
        <div>
          <span className="item-name">{this.props.name}</span>
          <span className="item-url">{this.props.url}</span>
        </div>

        <a onClick={this.onStatusIconClick}
           className={iconClass + statusClass}>
        </a>
      </li>
    );
  },
  getInitialState() {
    return {injected: this.props.injected ? true : false};
  },
  onStatusIconClick() {
    this.updateStates(!(this.state.injected || this.props.injected));
  },
  // Updates the states of the component itself and related components.
  // Keeps injected and search results in sync
  updateStates(state) {
    this.setState({injected: state});

    let libraries = app.props.libraries;
    let injected = libraries.state.injected;
    let results = libraries.state.results;

    if (state) {
      injected.push(this.props);
    } else {
      let index = injected.findIndex(item => item.name === this.props.name);
      injected.splice(index, 1);

      if (this.props.injected) {
        let matched = results.findIndex(item => item.name === this.props.name);
        let target = libraries.refs[`item-${matched}`];
        target.setState({
          injected: state
        });
      }
    }

    libraries.setState({injected, results});
    libraries.save();
    libraries.setBadge(injected.length);
  }
});
