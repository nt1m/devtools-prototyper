"use strict";
const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
const require = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const basePath = "chrome://devtools-prototyper";

const {Promise: promise} = Cu.import("resource://gre/modules/Promise.jsm", {});
const {console} = Cu.import("resource://gre/modules/devtools/Console.jsm", {});
const {ViewHelpers} = Cu.import("resource:///modules/devtools/ViewHelpers.jsm", {});

const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);

const Editor  = require("devtools/sourceeditor/editor");
const beautify = require("devtools/jsbeautify");
const {Storage, Element} = require(`${basePath}/content/modules/helpers.js`);
const {SettingsWidget} = require(`${basePath}/content/modules/settings.js`);
const {LibrariesWidget} = require(`${basePath}/content/modules/libraries.js`);

this.EXPORTED_SYMBOLS = ["PrototyperPanel"];

function PrototyperPanel(win, toolbox) {
	this.win = win;
	this.doc = this.win.document;
	this.toolbox = toolbox;
	this.target = this.toolbox.target;
	this.mm = toolbox.target.tab.linkedBrowser.messageManager;
	this.mm.loadFrameScript(`${basePath}/content/frame-script.js`, false);

	this.runCode = this.runCode.bind(this);
	this.loadSavedCode = this.loadSavedCode.bind(this);
	this.exportPrototype = this.exportPrototype.bind(this);
	this.showMenu = this.showMenu.bind(this);
	this.hideMenu = this.hideMenu.bind(this);

	this.initUI();
	this.initMenus();
	this.LibrariesWidget = new LibrariesWidget(this.doc);
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

		for (let lang in this.editorEls) {
			let editor = this.editorEls[lang];
			this.toggleButtons[lang].addEventListener("click", e => {
				editor.classList.toggle("hide");
				e.target.classList.toggle("active");
			});
		}

		this.SettingsWidget = new SettingsWidget(this.doc.getElementById("settings"), this);

		this.initEditors();

		this.runButton.addEventListener("click", this.runCode);
		this.beautifyButton.addEventListener("click", this.beautify.bind(this));
		this.settingsButton.addEventListener("click", this.SettingsWidget.togglePanel);
	},
	get settings() {
		return this.SettingsWidget.settings;
	},
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
			extraKeys: keys
		};

		if (this.settings["emmet-enabled"] && (lang == "html" || lang == "css")) {
			config.externalScripts = [`${basePath}/content/lib/emmet.min.js`];
		}

		this.editorEls[lang].innerHTML = "";

		// It seems, iframes inside hidden elements don't get their
		// contentWindow filled or something like that, this is a workaround
		// which makes sure the iframe container is visible while we are creating it
		const isHidden = this.editorEls[lang].classList.contains("hide");
		if (isHidden) this.editorEls[lang].classList.remove("hide");

		let sourceEditor = this.editors[lang] = new Editor(config);

		return sourceEditor.appendTo(this.editorEls[lang]).then(() => {
			if (isHidden) this.editorEls[lang].classList.add("hide");
			sourceEditor.on("change", () => {
				this.saveCode(lang);
			});
			sourceEditor.setMode(Editor.modes[lang].name);
		});
	},
	hideAllEditors: function() {
		this.enabledEditors = [];
		for (let key in this.editorEls) {
			let editor = this.editorEls[key];
			if (!editor.classList.contains("hide")) {
				this.enabledEditors.push(editor);
			}
			editor.classList.add("hide");
		}
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

		// select elements with id attributes ending in '-menu', except the the target menu
		let others = this.doc.querySelectorAll(`[id$="-menu"]:not(#${button.dataset.menu})`);
		for (let other of others) {

			let btn = this.doc.querySelector(`[data-menu="${other.id}"]`);
			this.hideMenu(btn);
		}
	},
	hideMenu: function(button) {
		let menu = this.doc.getElementById(button.dataset.menu);
		button.removeAttribute("open");
		menu.classList.remove("shown");
	},

	loadSavedCode: function() {
		for (let lang in this.editors) {
			this.editors[lang].setText(Storage.get(lang));
		}
	},
	saveCode: function(lang) {
		Storage.set(lang, this.editors[lang].getText());
	},

	getBuiltCode: function() {
		return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8"/>
	<meta name="description" content="${this.settings["prototype-description"]}"/>
	<title>${this.settings["prototype-title"]}</title>
	<style>
		${this.editors.css.getText().replace(/\n/g, "\n\t\t")}
	</style>
</head>
<body>
	${this.editors.html.getText().replace(/\n/g, "\n\t")}
	${this.LibrariesWidget.getHTML()}
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

	beautify: function() {
		for(let lang in this.editors) {
			let pretty = beautify[lang](this.editors[lang].getText());
			this.editors[lang].setText(pretty);
		}
	},

	exportPrototype: function(service, node) {
		let filename = "prototype.html",
		    description = `Prototype created using Firefox DevTools Prototyper\n${this.settings["prototype-description"]}`;

		let requestOptions = {url: "", elements: [], method: ""},
		    data = {};

		switch(service) {
			case "local":
				let code = this.getBuiltCode();
				let blob = new this.win.Blob([code], { type: "text/html" });
				let url = this.win.URL.createObjectURL(blob);
				node.download = filename;
				node.href = url;
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
					txtarea = Element("textarea", {
						name: lang,
						value: editor.getText()
					}, this.doc);
					requestOptions.elements.push(txtarea);
				}
				this.sendFormData(requestOptions);
			break;
			case "codepen":
				requestOptions = {
					"url": "http://codepen.io/pen/define",
					"method": "post",
					"elements": []
				};
				let {html, css, js} = this.editors;
				data = {
					"description": description,
					"html": html.getText(),
					"css": css.getText(),
					"js": js.getText()
				};
				let input = Element("input", {
					type: "hidden",
					name: "data",
					value: JSON.stringify(data)
				}, this.doc);
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
		let form = Element("form", {
			action: url,
			method: method.toLowerCase(),
			target: "_blank",
			container: this.doc.body,
			style: "display: none"
		}, this.doc);

		for (let el of elements) {
			form.appendChild(el);
		}

		form.submit();
		form.remove();
	}
}


