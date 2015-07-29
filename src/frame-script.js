addMessageListener("Prototyper::RunCode", function(message) {
	let data = message.data.code;
	let win = content.document.defaultView;
	let blob = new win.Blob([data], { type: "text/html" });
	let url = win.URL.createObjectURL(blob);

	win.location.href = url;
});