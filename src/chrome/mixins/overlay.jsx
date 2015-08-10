let Overlay = {
  overlayClassName: "overlay",
  shouldComponentUpdate(nextProps, nextState) {
    this.overlayClassName = "overlay " + (nextState.active ? "active" : "");
    return true;
  },
  getInitialState() {
    return {active: false};
  }
};
