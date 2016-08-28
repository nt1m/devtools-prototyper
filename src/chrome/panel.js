function PrototyperPanel(iframe, toolbox) {
  iframe.toolbox = toolbox;
  toolbox.initInspector().then(() => {
    iframe.dispatchEvent(new iframe.Event("inspector-loaded"));
  });
}
PrototyperPanel.prototype.destroy = function() {};

exports.PrototyperPanel = PrototyperPanel;
