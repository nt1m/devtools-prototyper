"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
const devtools = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const {Promise: promise} = Cu.import("resource://gre/modules/Promise.jsm", {});
const Editor  = devtools("devtools/sourceeditor/editor");
const beautify = devtools("devtools/jsbeautify");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/devtools/Console.jsm");
Cu.import("resource://gre/modules/Task.jsm");
const asyncStorage = devtools("devtools/toolkit/shared/async-storage");

const { ViewHelpers } = Cu.import("resource:///modules/devtools/ViewHelpers.jsm", {});
const L10N = new ViewHelpers.L10N("chrome://devtools-prototyper/locale/strings.properties");

const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;
const SELECTOR_HIGHLIGHT_TIMEOUT = 500;

this.EXPORTED_SYMBOLS = ["PrototyperPanel"];

function PrototyperPanel(win, toolbox) {
	this.win = win;
	this.doc = this.win.document;
	this.toolbox = toolbox;
	this.target = this.toolbox.target;
	this.mm = toolbox.target.tab.linkedBrowser.messageManager;
	this.mm.loadFrameScript("chrome://devtools-prototyper/content/frame-script.js", false);

	this.runCode = this.runCode.bind(this);
	this.loadSavedCode = this.loadSavedCode.bind(this);
	this.exportPrototype = this.exportPrototype.bind(this);
	this.showMenu = this.showMenu.bind(this);
	this.hideMenu = this.hideMenu.bind(this);
	//this._onCSSEditorMouseMove = this._onCSSEditorMouseMove.bind(this);
	this.libraries.init = this.libraries.init.bind(this);

	// The highlighter stuff doesn't work yet
	//this.initHighlighter();
	this.initUI();
	this.initMenus();
	this.libraries.init();
}

PrototyperPanel.prototype = {
	destroy: function() {
		this.win = this.doc = this.toolbox = this.mm = null;
	},
	// Init/Loading functions
	initUI: function() {
		this.editorEls = {
			html: this.doc.getElementById("html-editor"),
			css: this.doc.getElementById("css-editor"),
			js : this.doc.getElementById("js-editor")
		};
		this.runButton = this.doc.getElementById("run-button");
		this.exportButton = this.doc.getElementById("export-button");
		this.exportMenu = this.doc.getElementById("export-menu");
		this.beautifyButton = this.doc.getElementById("beautify-button");
		this.settingsButton = this.doc.getElementById("settings-button");
		this.toggleButtons = {
			html: this.doc.getElementById("toggle-html"),
			css : this.doc.getElementById("toggle-css"),
			js  : this.doc.getElementById("toggle-js")
		};
		// defaults
		this.settings = {
			"emmet-enabled": true,
			"es6-enabled": true
		};
		asyncStorage.getItem("devtools-prototyper-settings").then(settings => {
			if (!settings) {
				asyncStorage.setItem("devtools-prototyper-settings", this.settings);
				settings = this.settings;
			}
			this.settings = settings;

			for (let key in settings) {
				let el = this.settingsPanel.querySelector(`#${key}`);
				if (!el) {
					delete settings[key];
					continue;
				}
				putValue(el, settings[key]);
			}

			this.initEditors();
		});

		this.settingsPanel = this.doc.getElementById("settings");

		this.runButton.addEventListener("click", this.runCode);
		this.beautifyButton.addEventListener("click", this.beautify.bind(this));
		this.settingsButton.addEventListener("click", this.toggleSettings.bind(this));
		this.settingsPanel.addEventListener("change", this.updateSettings.bind(this));
	},
	initHighlighter: Task.async(function* () {
		yield this.toolbox.initInspector();
		this.walker = this.toolbox.walker;

		let hUtils = this.toolbox.highlighterUtils;
		if (hUtils.supportsCustomHighlighters()) {
			try {
				this.highlighter =
					yield hUtils.getHighlighterByType("SelectorHighlighter");
			} catch (e) {
				// The selectorHighlighter can't always be instantiated, for example
				// it doesn't work with XUL windows (until bug 1094959 gets fixed);
				// or the selectorHighlighter doesn't exist on the backend.
				console.warn("The selectorHighlighter couldn't be instantiated, " +
					"elements matching hovered selectors will not be highlighted");
			}
		}
	}),
	initEditors: function() {
		this.editors = {};
		let promises = [];
		for (let lang in this.editorEls) {
			promises.push(this.createEditor(lang));
		}
		Promise.all(promises).then(() => {
			this.editors.html.focus();
			this.loadSavedCode();
		});
	},
	createEditor: function(lang) {
		let mac = this.win.navigator.platform.toLowerCase().indexOf("mac") > -1;
		let mackeys = {
			"Cmd-Enter": this.runCode,
			"Cmd-R": this.runCode,
			"Cmd-S": () => this.showMenu(this.exportButton)
		};
		let winkeys = {
			"Ctrl-Enter": this.runCode,
			"Ctrl-R": this.runCode,
			"Ctrl-S": () => this.showMenu(this.exportButton)
		};
		let keys = mac ? mackeys : winkeys;

		let config = {
			lineNumbers: true,
			readOnly: false,
			autoCloseBrackets: "{}()[]",
			extraKeys: keys,
			//autocomplete: true
		};

		if (this.settings["emmet-enabled"] && (lang == "html" || lang == "css")) {
			config.externalScripts = ["chrome://devtools-prototyper/content/emmet.min.js"];
		}
		
//		if (lang == "css") {
//			this.editorEls[lang].addEventListener("mousemove", this._onCSSEditorMouseMove);
//		}

		this.editorEls[lang].innerHTML = "";

		let sourceEditor = this.editors[lang] = new Editor(config);

		this.toggleButtons[lang].addEventListener("click", e => {
			this.editorEls[lang].classList.toggle("hide");
			e.target.classList.toggle("active");
		});

		return sourceEditor.appendTo(this.editorEls[lang]).then(() => {
			sourceEditor.on("change", () => {
				this.saveCode(lang);
			});
			sourceEditor.setMode(Editor.modes[lang].name);
		});
	},
	initMenus: function() {
		let attachButtonToMenu = (button) => {
			let menu = this.doc.getElementById(button.dataset.menu);
			this.doc.body.addEventListener("click", () => this.hideMenu(button));
			button.addEventListener("click", e => {
				if (!menu.classList.contains("shown")) {
					this.showMenu(button);
					e.stopPropagation();
				}
				else {
					this.hideMenu(button);
				}
			});
			menu.addEventListener("click", e => e.stopPropagation());
		}
		for (let button of this.doc.querySelectorAll("[data-menu]")) {
			attachButtonToMenu(button);
		}
		/* Export Menu */
		for (let el of this.exportMenu.querySelectorAll(".item")) {
			el.addEventListener("click", e => {
				this.exportPrototype(e.target.dataset.service, e.target);
				this.hideMenu(this.exportButton);
				e.stopPropagation();
			});
		}
	},
	showMenu: function(button) {
		let menu = this.doc.getElementById(button.dataset.menu);
		button.setAttribute("open","true");
		menu.classList.add("shown");
	},
	hideMenu: function(button) {
		let menu = this.doc.getElementById(button.dataset.menu);
		button.removeAttribute("open");
		menu.classList.remove("shown");

		/* Libraries menu */
		this.libraries.resultsEl.textContent = "";
		this.libraries.filterEl.value = "";
		this.doc.getElementById("libraries-menu").classList.remove("results");
	},
	loadSavedCode: function() {
		for (let lang in this.editors) {
			this.editors[lang].setText(this.storage.get(lang));
		}
		let savedLibs;
		try {
			savedLibs = JSON.parse(this.storage.get("libs"));
		}
		catch(e) {
			console.warn(prefPrefix + "libs should be an array");
			this.storage.set("libs", "[]");
			savedLibs = [];
		}
		for (let lib of savedLibs) {
			this.libraries.add(lib);
		}	
	},
	saveCode: function(lang) {
		this.storage.set(lang, this.editors[lang].getText());
	},
	getLibraryHTML: function() {
		var str = "";
		let i = 0;
		for (let lib of this.libraries.current) {
			if (i !== 0) str += "	";
			str += `<script src="${lib}"></script>\n`;
			i++;
		}
		return str;
	},
	getBuiltCode: function() {
		return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8"/>
	<title>Prototype</title>
	<style>
		${this.editors.css.getText().replace(/\n/g, "\n\t\t")}
	</style>
</head>
<body>
	${this.editors.html.getText().replace(/\n/g, "\n\t")}
	${this.getLibraryHTML()}
	<script type="${this.settings["es6-enabled"] ? "text/javascript;version=1.8" : "text/javascript"}">
		${this.editors.js.getText().replace(/\n/g, "\n\t\t")}
	</script>
</body>
</html>`;
	},
	runCode: function() {
		this.mm.sendAsyncMessage("Prototyper::RunCode", {
			code: this.getBuiltCode()
		});
	},
	getBlobURL: function() {
		let data = this.getBuiltCode();
		let win = this.win;
		let blob = new win.Blob([data], { type: "text/html" });
		let url = win.URL.createObjectURL(blob);
		return url;
	},
	beautify: function() {
		for(let lang in this.editors) {
			let pretty = beautify[lang](this.editors[lang].getText());
			this.editors[lang].setText(pretty);
		}
	},
	toggleSettings: function() {
		if (this.settingsShown) this.hideSettings();
		else this.showSettings();
	},
	showSettings: function() {
		this.settingsShown = true;

		this.enabledEditors = [];
		for (let key in this.editorEls) {
			let editor = this.editorEls[key];
			if (!editor.classList.contains("hide")) {
				this.enabledEditors.push(editor);
			}
			editor.classList.add("hide");
		}

		this.settingsPanel.classList.remove("hide");
	},
	hideSettings: function() {
		this.settingsShown = false;

		this.enabledEditors.forEach(editor => editor.classList.remove("hide"));
		this.initEditors();

		this.settingsPanel.classList.add("hide");
	},
	updateSettings: function(e) {
		var id = e.target.id;
		this.settings[id] = getValue(e.target);
		asyncStorage.setItem("devtools-prototyper-settings", this.settings);
	},
	exportPrototype: function(service, node) {
		let filename = "prototype.html",
		    description = "Prototype created with Firefox DevTools Prototyper";

		let requestOptions = {url: "", elements: [], method: ""},
		    data = {};

		switch(service) {
			case "local":
				node.download = filename;
				node.href = this.getBlobURL();
			break;
			case "jsfiddle":
				requestOptions = {
					"url": "http://jsfiddle.net/api/post/library/pure/",
					"method": "post",
					"elements": []
				};
				let txtarea;
				for (let lang in this.editors) {
					let editor = this.editors[lang];
					txtarea = this.doc.createElement("textarea");
					txtarea.name = lang;
					txtarea.value = editor.getText();
					requestOptions.elements.push(txtarea);
					txtarea = null;
				}
				this.sendFormData(requestOptions);
			break;
			case "codepen":
				requestOptions = {
					"url": "http://codepen.io/pen/define",
					"method": "post",
					"elements": []
				};
				let {js, html, css} = this.editors;
				data = {
					"description": description,
					"html": html.getText(),
					"css": css.getText(),
					"js": js.getText()
				};
				let input = this.doc.createElement("input");
				input.type = "hidden";
				input.name = "data";
				input.value = JSON.stringify(data);
				requestOptions.elements.push(input);
				this.sendFormData(requestOptions);
			break;
			case "gist":
				data = {
					"files": {},
					"description": description,
					"public": true
				};
				data.files[filename] = {
					"content": this.getBuiltCode()
				};

				let xhr = new this.win.XMLHttpRequest();
				xhr.open("POST", "https://api.github.com/gists");
				xhr.addEventListener("load", () => {
					let response = JSON.parse(xhr.responseText);
					this.win.open(response.html_url);
				});
				xhr.send(JSON.stringify(data));
			break;
		}
	},
	/*
		sendFormData() :
		@args = {
			url: string
			method: string
			elements: array or nodelist (elements to append to the form)
		}
	*/
	sendFormData: function({url, method, elements}) {
		if(!url) {
			return;
		}
		method = method || "post";
		let form = this.doc.createElement("form");

		form.action = url;
		form.method = method.toLowerCase();
		form.target = "_blank";

		for (let el of elements) {
			form.appendChild(el);
		}

		form.style.display = "none";
		this.doc.body.appendChild(form);
		form.submit();
		form.remove();
	},
	/**
	 * Handle mousemove events, calling _highlightSelectorAt after a delay only
	 * and reseting the delay everytime.
	 */
	_onCSSEditorMouseMove: function(e) {
		this.highlighter.hide();

		if (this.mouseMoveTimeout) {
			this.win.clearTimeout(this.mouseMoveTimeout);
			this.mouseMoveTimeout = null;
		}

		this.mouseMoveTimeout = this.win.setTimeout(() => {
			this._highlightSelectorAt(e.clientX, e.clientY);
		}, SELECTOR_HIGHLIGHT_TIMEOUT);
	},

	/**
	 * Highlight nodes matching the selector found at coordinates x,y in the
	 * editor, if any.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 */
	_highlightSelectorAt: Task.async(function*(x, y) {
		// Need to catch parsing exceptions as long as bug 1051900 isn't fixed
		let info;
		try {
			let pos = this.editors["css"].getPositionFromCoords({left: x, top: y});
			info = this.editors["css"].getInfoAt(pos);
		} catch (e) {
			console.warn(e);
		}
		if (!info || info.state !== "selector") {
			return;
		}

		let stylesheetactorID = this.target.form.styleSheetsActor;
		let node = yield this.walker.getStyleSheetOwnerNode(stylesheetactorID);
		yield this.highlighter.show(node, {
			selector: info.selector,
			hideInfoBar: true,
			showOnly: "border",
			region: "border"
		});
	}),
	libraries: {
		init: function() {
			this.libraries.filterEl = this.doc.getElementById("libs-filter");
			this.libraries.injectedLibsEl = this.doc.getElementById("injected-libs");
			this.libraries.resultsEl = this.doc.getElementById("libraries-search-results");
			for (let fn in this.libraries) {
				if (typeof this.libraries[fn] == "function") {
					this.libraries[fn] = this.libraries[fn].bind(this);
				}
			}
			this.libraries.filterEl.addEventListener("input", () => this.libraries.find(this.libraries.filterEl.value));
		},
		current: [],
		find: function(query) {
			if (query.replace(/ /g, "") == "") {
				this.doc.getElementById("libraries-menu").classList.remove("results");
				return;
			}
			this.doc.getElementById("libraries-menu").classList.add("results");
			this.libraries.resultsEl.textContent = "";
			let URL = "http://api.cdnjs.com/libraries?search=" + query;
			let xhr = new this.win.XMLHttpRequest();
			xhr.open("GET", URL);
			xhr.addEventListener("readystatechange", () => {
				if (xhr.readyState == 4) {
					let response = JSON.parse(xhr.responseText);
					response.query = query;
					this.libraries.displayLibs(response);
				}
			});
			xhr.send();
		},
		saveLibs: function() {
			this.storage.set("libs", JSON.stringify(this.libraries.current));
		},
		displayLibs: function(response) {
			if (response.query != this.libraries.filterEl.value ||
			    response.results.length == 0 || !response.results) {
				this.libraries.resultsEl.textContent = L10N.getStr("prototyper.libs.noresultsfound");
				return;
			}
			let addResultItem = (item) => {
				let url = item.latest;
				let itemEl = this.doc.createElement("li");
				itemEl.className = "item";

				let textCont = this.doc.createElement("div");
				itemEl.appendChild(textCont);

				let nameDisp = this.doc.createElement("span");
				nameDisp.className = "item-name";
				nameDisp.textContent = item.name;
				textCont.appendChild(nameDisp);

				let urlDisp = this.doc.createElement("span");
				urlDisp.className = "item-url";
				urlDisp.textContent = url.replace("https://cdnjs.cloudflare.com/ajax/libs/", "");
				textCont.appendChild(urlDisp);

				let statusIcon = this.doc.createElement("a");
				statusIcon.href = "#";
				statusIcon.className = "devtools-icon lib-status-icon";
				statusIcon.classList.add((this.libraries.isAdded(item.latest) ? "checked" : "add"));
				statusIcon.addEventListener("click", () => {
					if (!this.libraries.isAdded(url)) {
						this.libraries.add(url);
						this.libraries.saveLibs();
						this.libraries.resultsEl.textContent = "";
						this.doc.getElementById("libraries-menu").classList.remove("results");
					}
				});
				itemEl.appendChild(statusIcon);
				this.libraries.resultsEl.appendChild(itemEl);
			};
			for (let i = response.results.length - 1;i >= 0; i--) {
				let result = response.results[i];
				addResultItem(result);
			}
		},
		add: function(url) {
			this.libraries.current.push(url);
			let el = this.doc.createElement("li");
			el.className = "item";

			let urlDisp = this.doc.createElement("a");
			urlDisp.className = "item-name";
			urlDisp.textContent = url.replace("https://cdnjs.cloudflare.com/ajax/libs/", "");
			urlDisp.title = url;
			urlDisp.href = url;
			urlDisp.target = "_blank";
			el.appendChild(urlDisp);

			let statusIcon = this.doc.createElement("a");
			statusIcon.href = "#";
			statusIcon.className = "devtools-icon lib-status-icon remove";
			statusIcon.addEventListener("click", (e) => {
				this.libraries.remove(url);
				el.remove();
				e.preventDefault();
			});
			el.appendChild(statusIcon);

			this.libraries.injectedLibsEl.appendChild(el);
		},
		remove: function(url) {
			let index = this.libraries.current.indexOf(url);
			this.libraries.current.splice(index, 1);
			this.libraries.saveLibs();
		},
		isAdded: function(url) {
			return this.libraries.current.indexOf(url) > -1;
		}
	},
	storage: {
		get: function(pref) {
			let prefname = prefPrefix + pref;
			if(!Services.prefs.getPrefType(prefname)) {
				Services.prefs.setCharPref(prefname, "");
				this.enablePrefSync(pref);
			}
			return Services.prefs.getCharPref(prefname);
		},
		set: function(pref, value) {
			Services.prefs.setCharPref(prefPrefix + pref, value);
		},
		enablePrefSync: function(pref) {
			Services.prefs.setBoolPref(syncPrefPrefix + pref, true);
		}
	}
};

function getValue(el) {
	if (typeof el.checked !== undefined) return el.checked;
	return el.value;
}

function putValue(el, value) {
	if (typeof el.checked !== undefined) el.checked = value;
	el.value = value;
}
