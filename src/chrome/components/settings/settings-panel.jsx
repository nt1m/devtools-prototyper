let SettingsPanel = React.createClass({
	render() {
		return <Overlay id="settings" ref="overlay">
		<form onSubmit={this.onSubmit}>
			<div className="column">
				<h1 className="title">{L10N.getStr("prototyper.prototypeSettings")}</h1>
				<SettingsItem id="prototype-title" type="text" label="prototyper.prototypeSettings.title" />
				<SettingsItem id="prototype-description" type="textarea" label="prototyper.prototypeSettings.description" />
			</div>
			<div className="column">
				<h1 className="title">{L10N.getStr("prototyper.settings")}</h1>
				<SettingsItem id="emmet-enabled" type="checkbox" label="prototyper.settings.enableEmmet" />
			</div>
		</form>
		</Overlay>;
	},
	getInitialState() {
		return {};
	},
	show() {
		this.refs.overlay.setState({active: true});
	},
	hide() {
		this.refs.overlay.setState({active: false});
	},
	toggle() {
		let active = !this.refs.overlay.state.active;
		this.refs.overlay.setState({active});
	},
	onSubmit(e) {
		e.preventDefault();
	},
	update() {
		this.setState(Settings.object());
	},
	componentDidMount() {
		this.update();
	}
});
