"use strict";
let app;
if (window.top !== window) {
  // we're inside the toolbox
  window.addEventListener("inspector-loaded", () => {
    app = <App />;
    React.render(app, document.querySelector("#wrapper"));
  });
} else {
  app = <App />;
  React.render(app, document.querySelector("#wrapper"));
}
