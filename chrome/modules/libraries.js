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
			console.warn(prefPrefix + "libs should be an array");
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
			this.remove(url);
			el.remove();
			e.preventDefault();
		});
		el.appendChild(statusIcon);

		this.injectedLibsEl.appendChild(el);
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
			statusIcon.classList.add((this.isInjected(item.latest) ? "checked" : "add"));
			statusIcon.addEventListener("click", () => {
				if (!this.isInjected(url)) {
					this.add(url);
					this.save();
					this.resultsEl.textContent = "";
					this.doc.getElementById("libraries-menu").classList.remove("results");
				}
			});
			itemEl.appendChild(statusIcon);
			this.resultsEl.appendChild(itemEl);
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