let LibrariesItem = React.createClass({
  render() {
    const iconClass = "devtools-icon lib-status-icon";
    return (
      <li className="item">
        <div>
          <span className="item-name">{this.props.name}</span>
          <span className="item-url">{this.props.url}</span>
        </div>

        <a className={iconClass + (this.state.injected ? "checked" : "add")}></a>
      </li>
    );
  }
})
