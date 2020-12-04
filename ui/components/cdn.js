import BaseElement from "./base.js";
import Storage from "../helpers/storage.js";

customElements.define('add-remove',
class extends BaseElement {
    constructor() {
        super();
        const template = template_add_remove.content.cloneNode(true);
        this._button = template.querySelector('[type="button"]');
        this._added = false;
        this._button.addEventListener("click", () => this.added = !this.added);
        this.shadowRoot.appendChild(template);
    }
    onClick(callback) {
        this._button.addEventListener("click", () => callback(this.added));
    }
    set added(added) {
        this._added = added;
        this._button.classList.toggle('remove', added);
        this._button.value = added?'Remove':'Add';
    }
    get added() {
        return this._added;
    }
});

customElements.define('search-result',
class extends BaseElement {
    constructor() {
        super();
        const template = search_result_template.content.cloneNode(true);
        this._button = template.querySelector('add-remove');
        this._link = template.querySelector('#link');
        this.shadowRoot.appendChild(template);
        this._add_remove = document.createElement("add-remove");
        this._add_remove.setAttribute("slot", "add-remove");

    }
    stylesheetsLoadedCallback() {
        this.append(this._add_remove);
    }
    onClick(callback) {
        this._add_remove.onClick(callback);
    }
    set href(href) {
        this._link.href = href;
    }
    get href() {
        return this._link.href;
    }
    set name(name) {
        if (!this._nameEl) {
            this._nameEl = document.createElement("span");
            this._nameEl.setAttribute("slot", "name");
            this.append(this._nameEl);
        }
        this._nameEl.textContent = name
    }
    get name() {
        return this._nameEl?.textContent;
    }

    set version(version) {
        if (!this._versionEl) {
            this._versionEl = document.createElement("span");
            this._versionEl.setAttribute("slot", "version");
            this.append(this._versionEl);
        }
        this._versionEl.textContent = version
    }
    get version() {
        return this._versionEl?.textContent;
    }

    set license(license) {
        if (!this._licenseEl) {
            this._licenseEl = document.createElement("div");
            this.shadowRoot.querySelector(".no-license").classList.remove("no-license");
            this._licenseEl.setAttribute("slot", "license");
            this.append(this._licenseEl);
        }
        this._licenseEl.textContent = license
    }
    get license(){
        return this._licenseEl?.textContent;
    }

    set url(url) {
        if (!this._urlEl) {
            this._urlEl = document.createElement("a");
            this._urlEl.setAttribute("slot", "url");
            this.append(this._urlEl);
        }
        this.setAttribute("url", url);
        this._urlEl.href = this._urlEl.textContent = url;
    }
    get url() {
        return this._urlEl?.href;
    }

    set description(description) {
        if (!this._descriptionEl) {
            this._descriptionEl = document.createElement("p");
            this._descriptionEl.setAttribute("slot", "description");
            this.append(this._descriptionEl);
        }
        this._descriptionEl.textContent = description;
    }
    get description() {
        return this._descriptionEl.textContent;
    }

    set added(added) {
        this._add_remove.added = added;
    }
    get added() {
        return this._add_remove.added;
    }
});

export default class Cdn {
    constructor(container) {
        this._libraries = {};
        this._container = document.createElement('div');
        this._searchBox = document.createElement('div');
        this._searchBox.classList.add("searchBox");
        this._searchBoxResults = document.createElement('div');
        this._librariesBox = document.createElement('div');
        this._librariesBox.innerHTML = "<h2 style=\"padding-left: 1em\">Added libraries:</h2>"
        this.visible = false;
        container.append(this._container);
        this._container.classList.add('cdn-container');
        this._input = document.createElement('input');
        this._input.setAttribute('type', 'text');
        this._input.setAttribute('placeholder', 'Search for a library');
        this._container.append(this._searchBox);
        this._container.append(this._librariesBox);
        this._searchBox.append(this._input);
        this._searchBox.append(this._searchBoxResults);
        let toId = null;
        this._input.addEventListener("input", () => {
            if (toId) clearTimeout(toId);
            toId = setTimeout(() => this.search(this._input.value), 300);
        });
        Storage.get("libraries", []).then(libraries => libraries.forEach(lib => this.add(lib)));

    }
    set visible(visible) {
        this._visible = visible;
        this._container.classList.toggle("visible", this._visible);
    }
    add(lib) {
        if (!Object.keys(this._libraries).includes(lib)) {
            const el = document.createElement("search-result");
            const [name, version] = lib.split("/").slice(lib.split("/").indexOf("libs")+1);
            el.url = lib;
            el.name = name;
            el.version = version;
            el.added = true;
            el.onClick(() => {
                this.remove(lib);
            });
            this._libraries[lib] = el;
            this._librariesBox.append(el);
        }
        Storage.set("libraries", Object.keys(this._libraries));
    }
    remove(lib) {
        const resultEl = this._searchBoxResults.querySelector(`[url="${lib}"]`);
        if (resultEl) resultEl.added = false;
        this._libraries[lib]?.remove();
        delete this._libraries[lib];
        Storage.set("libraries", Object.keys(this._libraries));
    }
    get scripts() {
        return Object.keys(this._libraries).map(url => `<script src="${url}"></script>`).join();
    }
    async search (name) {
        this._searchBoxResults.innerHTML = "";
        if (name.length < 2) return;
        const {results, total, available} = (await (await fetch("https://api.cdnjs.com/libraries?search="+name+"&fields=description,version,license,homepage&limit=20")).json());
        results.forEach(result => {
            const el = document.createElement("search-result");

            el.name = result.name;
            el.description = result.description;
            el.version = result.version;
            el.license = result.license;
            el.href = el.homepage;
            el.url = result.latest;
            el.append(name);
            el.onClick(toggle => {
                if (toggle) this.add(result.latest);
                else this.remove(result.latest);
            });

            this._searchBoxResults.append(el);
        });
    }
}
