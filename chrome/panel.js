"use strict";

// Import stuff
const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
const devtools = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const {Promise: promise} = Cu.import("resource://gre/modules/Promise.jsm", {});
const Editor  = devtools("devtools/sourceeditor/editor");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import('resource://gre/modules/devtools/Console.jsm');

// Constants
const prefPrefix = "extensions.devtools-prototyper.";
const syncPrefPrefix = "services.sync.prefs.sync." + prefPrefix;

this.EXPORTED_SYMBOLS = ["PrototyperPanel"];

function PrototyperPanel(win, toolbox) {
	this.win = win;
	this.doc = this.win.document;
	this.toolbox = toolbox;
	
	this.runCode = this.runCode.bind(this);
	this.loadSavedCode = this.loadSavedCode.bind(this);
	this.exportPrototype = this.exportPrototype.bind(this);
	this.showExportMenu = this.showExportMenu.bind(this);
	this.hideExportMenu = this.hideExportMenu.bind(this);

	this.initUI();
	this.initExportMenu();
}

PrototyperPanel.prototype = {
	// Destroy function
	destroy: function() {
		this.win = this.doc = this.toolbox = this.mm = null;
	},

	// Init/Loading functions
	initUI: function() {
		console.log("initUI");
		this.editorEls = {
			"html": this.doc.querySelector("#html-editor"),
			"css" : this.doc.querySelector("#css-editor"),
			"js"  : this.doc.querySelector("#js-editor")
		};
		this.runButton = this.doc.querySelector("#run-button");
		this.exportButton = this.doc.querySelector("#export-button");
		this.exportMenu = this.doc.querySelector("#export-menu");

		this.runButton.addEventListener("click", this.runCode);
		this.initEditors();
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
			"Cmd-S": this.showExportMenu
		};
		let winkeys = {
			"Ctrl-Enter": this.runCode,
			"Ctrl-R": this.runCode,
			"Ctrl-S": this.showExportMenu
		};
		let keys = mac ? mackeys : winkeys;

		let config = {
			lineNumbers: true,
			readOnly: false,
			autoCloseBrackets: "{}()[]",
			extraKeys: keys
		};

		if (lang == "html") {
			// This only works after bug 1089428
			config.externalScripts = ["chrome://devtools-prototyper/content/emmet.min.js"];
		}

		let sourceEditor = this.editors[lang] = new Editor(config);
		return sourceEditor.appendTo(this.editorEls[lang]).then(() => {
			sourceEditor.on("change", () => {
				this.saveCode(lang);
			});
			sourceEditor.setMode(Editor.modes[lang].name);
		});
	},
	initExportMenu: function() {
		this.doc.body.addEventListener("click", this.hideExportMenu);
		this.exportButton.addEventListener("click", e => {
			if(!this.exportMenu.classList.contains("shown")) {
				this.showExportMenu();
			}
			else {
			  this.hideExportMenu();
			}
			e.stopPropagation();
		});
		for(let el of this.exportMenu.querySelectorAll(".item")) {
			el.addEventListener("click", e => {
				console.log("service: ", e.target.dataset.service);
				this.exportPrototype(e.target.dataset.service, e.target);
			});
		}
	},
	showExportMenu: function() {
		this.exportButton.setAttribute("open","true");
		this.exportMenu.classList.add("shown");
	},
	hideExportMenu: function() {
		this.exportButton.removeAttribute("open");
		this.exportMenu.classList.remove("shown");
	},
	loadSavedCode: function() {
		console.log(this.editors);
		for (let lang in this.editors) {
			console.log(lang);
			// this.editors[lang].setText(this.storage.get(lang));
		}
	},
	saveCode: function(lang) {
		this.storage.set(lang, this.editors[lang].getText());
	},
	getBuiltCode: function() {
		return [
			"<!DOCTYPE html>\n",
			"<html>\n",
			"<head>\n",
			"<meta charset='utf-8'/>",
			"<script>\n",
			this.editors.js.getText(),
			"\n</script>\n",
			"<style>\n",
			this.editors.css.getText(),
			"\n</style>\n",
			"</head>\n",
			"<body>",
			this.editors.html.getText(),
			"</body>",
			"</html>"
		].join("");
	},
	runCode: function() {
		this.toolbox.target.activeTab.navigateTo(this.getBlobURL());
	},
	getBlobURL: function() {
		let data = this.getBuiltCode();
		let blob = new this.win.Blob([data], { type: "text/html" });
		let url = this.win.URL.createObjectURL(blob);
		return url;
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
				for(let [lang, editor] of this.editors.entries()) {
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
