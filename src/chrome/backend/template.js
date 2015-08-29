let buildCode = function() {
  const editors = app.props.editors.refs;
  return `<head>
<meta charset="UTF-8"/>
<meta name="description" content="${Storage.get("prototype-description")}"/>
<title>${Storage.get("prototype-title")}</title>
<style>
  ${editors.css.props.cm.getText().replace(/\n/g, "\n\t\t")}
</style>
</head>
<body>
  ${editors.html.props.cm.getText().replace(/\n/g, "\n\t\t")}
</body>`;
};

let exportedCode = {
  get html() {
    const editors = app.props.editors.refs;
    return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="description" content="${Storage.get("prototype-description")}"/>
  <title>${Storage.get("prototype-title")}</title>
  <link href="css/style.css" rel="stylesheet"/>
</head>
<body>
  ${editors.html.props.cm.getText().replace(/\n/g, "\n\t\t")}
  ${Code.getLibraries()}
  <script src="js/script.js"></script>
</body>
</html>`;
  },
  get css() {
    const editors = app.props.editors.refs;
    return editors.css.props.cm.getText();
  },
  get js() {
    const editors = app.props.editors.refs;
    return editors.js.props.cm.getText();
  }
};
