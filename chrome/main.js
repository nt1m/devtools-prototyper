"use strict";
const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
const {ViewHelpers} = Cu.import("resource:///modules/devtools/ViewHelpers.jsm", {});
const basePath = "chrome://devtools-prototyper";
// XXX : Move all strings from strings.dtd to strings.properties
const L10N = new ViewHelpers.L10N(`${basePath}/locale/strings.properties`);

const Events = {
	LIBRARY_CHANGE: "Prototyper::LibraryChange",
	CODE_RUN: "Prototyper::CodeRun",
	SETTINGS_CHANGE: "Prototyper::SettingsChange"
}
let appView = React.createClass({
	getInitialState() {
		return {}
	},
	render() {
		return (<ExportMenu />
				<div class="devtools-container">
					<IconSidebar buttons="{this.state.buttons}" selectedButton="{this.state.selectedIcon}"/>
					<LibrarySidebar injectedLibs="{this.state.injectedLibs}"/>
					<Editors code="{this.state.code}"/>
					<Settings state="{this.state.settings}"/>
				</div>);
	}
});
let IconList = [
	{
		id: "",
		tooltip: L10N("foo"),
		icon: "",
		toggle: "",
		onClick: () => {}
	}
];
let IconSidebar = React.createClass({
	getInitialState() {
		return {
			selectedButton: null
		}
	},
	render() {
		let buttons = this.props.button.map( (value, index) => {
			
		});
		return (<div class="sidebar">{buttons}</div>);
	}
}
let SidebarButton = React.createClass({
	render() {
		return (<button id={this.props.id} title={this.props.tooltip} onClick={this.props.onClick}>
			   		<i class="devtools-icon {value.icon}"></i>
				</button>);
	},
});

let Editors = React.createClass({
	render() {
		return (<Editor lang="html">
				<Editor lang="css">
		 		<Editor lang="js">)
	}
});

let Editor = React.createClass({
	render() {
		return (<div class="devtools-main-content" data-lang={this.props.lang}></div>);
	},
	componentDidMount() {
		// Setup the editor stuff in here.
	}
});
let Settings = React.createClass({
	render() {},
	componentDidMount() {
		// Load settings
	},
});
let Setting = React.createClass({
	render() {}
});