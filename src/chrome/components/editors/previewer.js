"use strict";
/* exported Previewer */

function appendTransparentPreview(container) {
  let transparentPreview = document.createElement("div");
  transparentPreview.className = "tooltip-inner transparent-preview";
  container.parentNode.appendChild(transparentPreview);
}

// TODO: Rewrite each previewer with React
let previewers = {
  "background": function(container, property, value) {
    container.style.setProperty(property, value);
    appendTransparentPreview(container);

    if (container.getAttribute("style") == "") {
      return false;
    }
    return true;
  },
  "color": function(container, property, value) {
    container.style.setProperty("background-color", value);
    appendTransparentPreview(container);

    if (container.getAttribute("style") == "") {
      return false;
    }
    return true;
  },
  "mix-blend-mode": function(container, property, value) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    let svgEl = document.createElementNS(SVG_NS, "svg");
    container.classList.add("mix-blend-mode");

    let createCircle = (color, position) => {
      let circle = document.createElementNS(SVG_NS, "circle");
      let {x, y} = position;
      circle.setAttribute("r", "40");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("fill", color);
      svgEl.appendChild(circle);
      return circle;
    };
    createCircle("#f54545", {x: 40, y: 40});
    createCircle("green", {x: 80, y: 40});
    createCircle("#4e4ef5", {x: 60, y: 80});
    container.appendChild(svgEl);

    let text = document.createElement("label");
    text.textContent = "A";
    container.appendChild(text);

    let previewStyle = document.createElement("style");
    previewStyle.setAttribute("scoped", "true");
    previewStyle.textContent = `circle,label {mix-blend-mode: ${value}}`;
    container.appendChild(previewStyle);
    return true;
  },
  "filter": function(container, property, value) {
    let span = document.createElement("span");
    container.appendChild(span);
    container.classList.add("filter-preview");
    
    let original = document.createElement("div");
    original.className = "original";
    container.appendChild(original);

    let afterPreview = document.createElement("div");
    afterPreview.className = "new";
    afterPreview.style.setProperty("filter", value);
    container.appendChild(afterPreview);
    return true;
  }
};

let shorthandMap = {
  "background-color": "background",
  "background-image": "background",
  "fill": "color",
  "stroke": "color"
};

let bannedValues = ["inherit", "initial", "unset", "none"];

class Previewer {
  static isAvailable(property, value) {
    return (shorthandMap.hasOwnProperty(property) ||
            previewers.hasOwnProperty(property))
           && !bannedValues.includes(value);
  }
  constructor(property, value, {x, y}) {
    let tooltip = document.createElement("div");
    tooltip.className = "tooltip";

    let previewerUsed = property;
    if (shorthandMap.hasOwnProperty(property)) {
      previewerUsed = shorthandMap[property];
    }

    let tooltipInner = document.createElement("div");
    tooltipInner.className = "tooltip-inner main-inner";
    tooltip.appendChild(tooltipInner);

    let result = previewers[previewerUsed](tooltipInner, property, value);

    if (!result) {
      tooltip.remove();
      return null;
    }

    tooltip.style.top = `${y}px`;
    tooltip.style.left = `${x}px`;

    document.body.appendChild(tooltip);

    if (tooltip.clientHeight + y > document.body.clientHeight) {
      tooltip.style.top = (y - tooltip.clientHeight) + "px";
      tooltip.classList.add("top");
    }
    this.tooltip = tooltip;
    return this;
  }

  destroy() {
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }
}
