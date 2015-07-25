const basePath = "chrome://devtools-prototyper";
const {Storage, Element} = require(`${basePath}/content/modules/helpers.js`);
function SettingsWidget(panel, view) {
	this.panel = panel;
	this.view = view;

	this.togglePanel = this.togglePanel.bind(this);

	this.init();
}
SettingsWidget.prototype = {
	settings: {
		"emmet-enabled": true,
		"es6-enabled": true
	},
	init: function() {
		if (!Storage.get("settings")) {
			Storage.set("settings", "[]");
		}
		let settings = JSON.parse(Storage.get("settings"));
		this.settings = settings;
		for (let key in settings) {
			let el = this.panel.querySelector(`#${key}`);
			if (!el) {
				delete settings[key];
				continue;
			}
			if (typeof el.checked !== "undefined") {
				el.checked = settings[key];
			}
			el.value = settings[key];
		}

		this.panel.addEventListener("change", this.updateSettings.bind(this));
	},
	togglePanel: function() {
		if (this.panelShown) this.hidePanel();
		else this.showPanel();
	},
	showPanel: function() {
		this.view.hideAllEditors();
		this.panel.classList.remove("hide");
	},
	hidePanel: function() {
		this.view.enabledEditors.forEach(editor => editor.classList.remove("hide"));
		this.view.initEditors();

		this.panel.classList.add("hide");
	},
	get panelShown() {
		return !this.panel.classList.contains("hide");
	},
	updateSettings: function(e) {
		let el = e.target;
		let id = el.id;
		this.settings[id] = typeof el.checked !== undefined ? 
		                    el.checked : el.value;
		Storage.set("settings", JSON.stringify(this.settings));
	},
}
exports.SettingsWidget = SettingsWidget;