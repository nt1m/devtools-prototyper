let LibrariesItem = React.createClass({
  render() {
    const iconClass = "devtools-icon ";
    const statusClass = (this.state.injected || this.props.injected) ? "remove"
                                                                     : "add";
    return (
      <li className="item">
        <div>
          <span className="item-name">{this.props.name}</span>
          <a target="_blank" href={this.props.latest}
             className="item-url">{this.props.url}</a>
        </div>

        <a onClick={this.onStatusIconClick}
           className={iconClass + statusClass}>
        </a>
      </li>
    );
  },
  getInitialState() {
    return {injected: this.props.injected};
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
      // Add item in injected libs if state == true
      injected.push(this.props);
    } else {
      // Remove item from injected libs if state == false
      let index = injected.findIndex(item => item.name === this.props.name);
      injected.splice(index, 1);

      // Keep the injected and search results in sync
      if (this.props.injected) {
        let matched = results.findIndex(item => item.name === this.props.name);
        if (matched > -1) {
          let target = libraries.refs[`item-${matched}`];
          target.setState({
            injected: state
          });
        }
      }
    }

    libraries.setState({injected, results});
    libraries.save();
    libraries.setBadge(injected.length);
  }
});
