let buildCode = function() {
  const editors = app.props.editors.props;
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
