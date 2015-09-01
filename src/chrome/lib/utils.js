function debounce(callback, delay) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      callback.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

function openExportMenu() {
  let sidebarButton = app.props.sidebar.refs.export;
  sidebarButton.activate();

  app.props.export.activate();
}

document.addEventListener('keydown', e => {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    openExportMenu();
  }
})
