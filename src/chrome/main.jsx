"use strict";
let app;
window.addEventListener("inspector-loaded", () => {
  app = <App />;
  React.render(app, document.querySelector("#wrapper"));
});
