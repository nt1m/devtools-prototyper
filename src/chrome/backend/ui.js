let UI = {
  closeMenus(except) {
    let menus = [app.props.libraries, app.props.settings, app.props.export];

    for (let menu of menus) {
      if (menu === except) {
        continue;
      }
      menu.deactivate();

      let id = menu.getDOMNode().id.replace("-menu", "");
      app.props.sidebar.refs[id].deactivate();
    }
  }
};
