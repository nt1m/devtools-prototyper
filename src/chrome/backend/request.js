let request = function({url, method, data, submitForm}) {
  method = method || "POST";
  let copy = {};

  for (let key in data) {
    if (typeof data[key] === "function") {
      copy[key] = data[key]();
    } else {
      copy[key] = data[key];
    }
  }

  if (submitForm) {
    let form = document.createElement("form");
    form.target = "_blank";
    form.action = url;
    form.method = method;

    for (let key in copy) {
      let input = document.createElement("input");
      input.name = key;
      input.value = copy[key];
      form.appendChild(input);
    }

    form.hidden = true;
    document.body.appendChild(form);
    form.submit();
    form.remove();
    return Promise.resolve(true);
  }

  copy = JSON.stringify(copy);

  let req = new XMLHttpRequest();
  req.responseType = "json";
  req.open(method, url);

  let promise = new Promise((resolve, reject) => {
    req.addEventListener("load", () => {
      resolve(req.response);
    });
    req.addEventListener("error", reject);
  });

  req.send(copy);

  return promise;
};
