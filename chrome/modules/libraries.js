const basePath = "chrome://devtools-prototyper";
const {Storage, Element} = require(`${basePath}/content/modules/helpers.js`);
function LibrariesWidget(doc) {
	this.doc = doc;
	this.init(doc);
}
LibrariesWidget.prototype = {
	init: function() {
		this.badgeEl = this.doc.querySelector("#libraries-button > .badge");
		this.filterEl = this.doc.getElementById("libs-filter");
		this.injectedLibsEl = this.doc.getElementById("injected-libs");
		this.resultsEl = this.doc.getElementById("libraries-search-results");

		this.filterEl.addEventListener("input", () => this.find(this.filterEl.value));

		this.loadPreviousLibraries();
	},
	loadPreviousLibraries() {
		let savedLibs;
		try {
			savedLibs = JSON.parse(Storage.get("libs"));
		}
		catch(e) {
			console.warn("extensions.devtools-prototyper.libs should be an array");
			Storage.set("libs", "[]");
			savedLibs = [];
		}
		for (let lib of savedLibs) {
			this.LibrariesWidget.add(lib);
		}
	},
	injected: [],
	add: function(url) {
		this.injected.push(url);
		let el = Element("li", {
			class: "item",
			container: this.injectedLibsEl
		}, this.doc);

		let urlDisp = Element("a", {
			class: "item-name",
			content: url.replace("https://cdnjs.cloudflare.com/ajax/libs/", ""),
			title: url,
			href: url,
			target: "_blank",
			container: el
		}, this.doc);

		let statusIcon = Element("a", {
			href: "#",
			class: "devtools-icon lib-status-icon remove",
			onclick: (e) => {
				this.remove(url);
				el.remove();
				e.preventDefault();
			},
			container: el
		}, this.doc);

		this.updateBadge();
	},
	remove: function(url) {
		let index = this.injected.indexOf(url);
		this.injected.splice(index, 1);
		this.save();
		this.updateBadge();
	},
	isInjected: function(url) {
		return this.injected.indexOf(url) > -1;
	},
	save: function() {
		Storage.set("libs", JSON.stringify(this.injected));
	},
	updateBadge: function() {
		let length = this.injected.length;
		let val =  length > 0 ? length : "";
		this.badgeEl.textContent = val;
	},
	getHTML: function() {
		var str = "";
		let i = 0;
		for (let lib of this.injected) {
			if (i !== 0) str += "	";
			str += `<script src="${lib}"></script>`;
			i++;
		}
		return str;
	},

	/*
		find() : Fetches libraries matching a query then calls displayResults
		@args :
			- query : Search query
	*/
	find: function(query) {
		if (query.replace(/ /g, "") == "") {
			this.doc.getElementById("libraries-menu").classList.remove("results");
			return;
		}
		this.doc.getElementById("libraries-menu").classList.add("results");
		this.resultsEl.textContent = "";
		let URL = "http://api.cdnjs.com/libraries?search=" + query;
		let xhr = new this.doc.defaultView.XMLHttpRequest();
		xhr.open("GET", URL);
		xhr.addEventListener("readystatechange", () => {
			if (xhr.readyState == 4) {
				let response = JSON.parse(xhr.responseText);
				response.query = query;
				this.displayResults(response);
			}
		});
		xhr.send();
	},
	/*
		displayResults() : Displays search results
		@args :
			- response : XHR response
	*/
	displayResults: function(response) {
		if (response.query != this.filterEl.value ||
		    response.results.length == 0 || !response.results) {
			this.resultsEl.textContent = "";
			return;
		}
		let addResultItem = (item) => {
			let url = item.latest;
			let itemEl = Element("li", {
				class: "item",
				container: this.resultsEl
			}, this.doc);

			let textCont = Element("div", {
				container: itemEl
			}, this.doc);

			let nameDisp = Element("span", {
				class: "item-name",
				content: item.name,
				container: textCont
			}, this.doc);

			let urlDisp = Element("span", {
				class: "item-url",
				content: url.replace("https://cdnjs.cloudflare.com/ajax/libs/", ""),
				container: textCont
			}, this.doc);

			let statusIcon = Element("a", {
				href: "#",
				class: "devtools-icon lib-status-icon",
				onclick: () => {
					if (!this.isInjected(url)) {
						this.add(url);
						this.save();
						this.resultsEl.textContent = "";
						this.doc.getElementById("libraries-menu").classList.remove("results");
					}
				},
				container: itemEl
			}, this.doc);
			statusIcon.classList.add((this.isInjected(item.latest) ? "checked" : "add"));
		};
		for (let i = response.results.length - 1;i >= 0; i--) {
			let result = response.results[i];
			addResultItem(result);
		}
	},

	/*
		hideResultsContainer() : Hides results container
	*/
	hideResultsContainer: function() {
		this.resultsEl.textContent = "";
		this.filterEl.value = "";
		this.doc.getElementById("libraries-menu").classList.remove("results");
	}
}
exports.LibrariesWidget = LibrariesWidget;