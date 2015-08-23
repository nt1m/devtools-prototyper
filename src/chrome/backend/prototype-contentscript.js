self.port.on("html", html => {
  document.documentElement.innerHTML = html
  let scripts = document.querySelectorAll("script");

  let libsPromises = [];
  for (let script of scripts) {
    let el = document.createElement("script");
    el.type = "text/javascript;version=1.8";
    el.textContent = script.textContent;

    if (script.src) {
      let promise = new Promise((resolve) => {
        el.onload = resolve;
      });
      el.src = script.src;
      libsPromises.push(promise);
      document.body.appendChild(el);
    } else {
      Promise.all(libsPromises).then(() => document.body.appendChild(el));
    }

    script.remove();
  }
});  