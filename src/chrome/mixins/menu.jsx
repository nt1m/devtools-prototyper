let Menu = {
  menuClassName: "menu",
  shouldComponentUpdate(nextProps, nextState) {
    this.menuClassName = "menu " + (nextState.active ? "active" : "");
    return true;
  },
  getInitialState() {
    return {active: false};
  }
};
