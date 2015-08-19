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
