import Editor from "./components/editor/editor.js";

class Main {
  constructor({
    container = document.body,
    mode = "web",
  } = {}) {
    container.classList.add("prototyper-container", mode);

    const toolbar = document.createElement("prototyper-toolbar");
    const editor = document.createElement("prototyper-editor");
    container.append(toolbar, editor);
  }
}

new Main();