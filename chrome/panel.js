"use strict";

// Import stuff
const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
const devtools = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools.require;
const {Promise: promise} = Cu.import("resource://gre/modules/Promise.jsm", {});
const Editor  = devtools("devtools/sourceeditor/editor");
Cu.import("resource://gre/modules/Services.jsm");

// Constants
const prefPrefix = "extensions.devtools-prototyper.";

this.EXPORTED_SYMBOLS = ["PrototyperPanel"];

function PrototyperPanel(win, toolbox) {
	this.win = win;
	this.doc = this.win.document;
	this.toolbox = toolbox;
	
	this.runCode = this.runCode.bind(this);
	this.loadSavedCode = this.loadSavedCode.bind(this);
	this.exportPrototype = this.exportPrototype.bind(this);
	this.showExportMenu = this.showExportMenu.bind(this);

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
		this.editorEls = {
			"html": this.doc.querySelector("#html-editor"),
			"css": this.doc.querySelector("#css-editor"),
			"js": this.doc.querySelector("#js-editor")
		};
		this.runButton = this.doc.querySelector("#run-button");
		this.exportButton = this.doc.querySelector("#export-button");
		this.exportMenu = this.doc.querySelector("#export-menu");

		this.runButton.addEventListener("click", this.runCode);
		this.initEditors();
	},
	initEditors: function() {
		this.editors = {}
		for (var lang in this.editorEls) {
			this.createEditor(lang);
		}
	},
	createEditor: function(lang) {
		var mac = this.win.navigator.platform.toLowerCase().indexOf("mac") > -1;
		var mackeys = {
			"Cmd-Enter": this.runCode,
			"Cmd-R": this.runCode,
			"Cmd-S": this.showExportMenu
		};
		var winkeys = {
			"Ctrl-Enter": this.runCode,
			"Ctrl-R": this.runCode,
			"Ctrl-S": this.showExportMenu
		};
		var keys = mac ? mackeys : winkeys;
		var config = {
			lineNumbers: true,
			readOnly: false,
			autoCloseBrackets: "{}()[]",
			extraKeys: keys
		};

		var sourceEditor = this.editors[lang] = new Editor(config);
		var _ = this;
		sourceEditor.appendTo(this.editorEls[lang]).then(() => {
			sourceEditor.on("change", () => {
				_.saveCode(lang)
			});
			sourceEditor.setMode(Editor.modes[lang].name);
			// TODO : Move this somewhere else ?
			if(lang == "js") {
				this.editors.html.focus();
				this.loadSavedCode();
			}
		});
	},
	initExportMenu: function() {
		var _ = this;
		this.doc.body.addEventListener("click", function() {
			_.exportButton.removeAttribute("open");
			_.exportMenu.style.display = "none";
		});
		this.exportButton.addEventListener("click", function(e) {
			_.showExportMenu();
			e.stopPropagation();
		});
		for(var el of this.exportMenu.querySelectorAll(".item")) {
			el.addEventListener("click", function() {
				_.exportPrototype(this.dataset.service, this);
			});
		}
	},
	showExportMenu: function() {
		this.exportButton.setAttribute("open","true");
		this.exportMenu.style.display = "block";
	},
	loadSavedCode: function() {
		for (var editor in this.editors) {
			this.editors[editor].setText(this.storage.get(editor))
		}
	},
	saveCode: function(lang) {
		this.win.console.log(this.editors[lang].getText());
		this.storage.set(lang, this.editors[lang].getText())
	},
	getBuiltCode: function() {
		return [
			"<!DOCTYPE html>\n",
			"<html>\n",
			"<head>\n",
			"<script>\n",
			this.editors["js"].getText(),
			"\n</script>\n",
			"<style>\n",
			this.editors["css"].getText(),
			"\n</style>\n",
			"</head>\n",
			"<body>",
			this.editors["html"].getText(),
			"</body>",
			"</html>"
		].join("");
	},
	runCode: function() {
		this.toolbox.target.activeTab.navigateTo(this.getBlobURL());
	},
	getBlobURL: function() {
		var data = this.getBuiltCode();
		var blob = new this.win.Blob([data], {type:"text/html"});
		var url = this.win.URL.createObjectURL(blob);
		return url;
	},
	exportPrototype: function(service, node) {
		var filename = "prototype.html";
		var description = "Prototype created with Firefox DevTools Prototyper";
		var _ = this;
		switch(service) {
			case "local":
				node.download = filename;
				node.href = this.getBlobURL();
			break;
			case "jsfiddle":
				var requestOptions = {
					"url": "http://jsfiddle.net/api/post/library/pure/",
					"method": "post",
					"elements": []
				};
				var txtarea;
				for(var lang in this.editors) {
					txtarea = this.doc.createElement("textarea");
					txtarea.name = lang;
					txtarea.value = this.editors[lang].getText();
					requestOptions.elements.push(txtarea);
					txtarea = null;
				}
				this.sendFormData(requestOptions);
			break;
			case "codepen":
				var requestOptions = {
					"url": "http://codepen.io/pen/define",
					"method": "post",
					"elements": []
				};
				var editors = this.editors;
				var data = {
					"description": description,
					"html": editors["html"].getText(),
					"css": editors["css"].getText(),
					"js": editors["js"].getText()
				}
				var input = this.doc.createElement("input");
				input.type = "hidden";
				input.name = "data";
				input.value = JSON.stringify(data);
				requestOptions.elements.push(input);
				this.sendFormData(requestOptions);
			break;
			case "gist":
				var data = {
					"files": {},
					"description": description,
					"public": true
				};
				data["files"][filename] = {
					"content": this.getBuiltCode()
				};

				var xhr = new this.win.XMLHttpRequest();
				xhr.open("POST", "https://api.github.com/gists");
				xhr.addEventListener("load", function() {
					var response = JSON.parse(xhr.responseText);
					_.win.open(response["html_url"]);
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
	sendFormData: function(args) {
		if(!args.url) {
			return;
		}
		var posturl = args.url;
		var method = args.method || "post";
		var form = this.doc.createElement("form");
		form.action = posturl;
		form.method = method.toLowerCase();
		form.target = "_blank";
		for (var el of args.elements) {
			form.appendChild(el);
		}
		form.style.display = "none";
		this.doc.body.appendChild(form);
		form.submit();
		form.remove();
	},
	storage: {
		get: function(pref) {
			var prefname = prefPrefix + pref;
			if(Services.prefs.getPrefType(prefname)) {
				Services.prefs.getCharPref(prefname);
			}
			else {
				Services.prefs.setCharPref(prefname, "");
				this.enablePrefSync(pref);
			}
			return Services.prefs.getCharPref(prefname);
		},
		set: function(pref, value) {
			Services.prefs.setCharPref(prefPrefix + pref, value)
		},
		enablePrefSync: function(pref) {
			var syncPrefPrefix = "services.sync.prefs.sync.";
			Services.prefs.setBoolPref(syncPrefPrefix + prefPrefix + pref, true)
		}
	}
};