let Togglable = {
  activate() {
    UI.closeMenus(this);
    this.setState({active: true});
  },
  deactivate() {
    this.setState({active: false});
  },
  toggle() {
    let newState = !this.state.active;
    if (newState) {
      UI.closeMenus(this);
    }

    this.setState({active: newState});
  }
}
