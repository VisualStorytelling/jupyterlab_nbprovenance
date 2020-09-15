"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Legend = void 0;
var typestyle_1 = require("typestyle");
var react_1 = require("react");
var legendBorderDivStyle = typestyle_1.style({
    borderRadius: "4px",
    border: "4px solid",
    display: "inline-block",
    color: "#ffffff",
    fontFamily: "Lato,Helvetica Neue,Arial,Helvetica,sans-serif",
    fontSize: "14px",
    padding: "5px 5px",
    margin: "10px 10px 10px 0px"
});
var eventIconStyle = typestyle_1.style({
    verticalAlign: "middle"
});
var eventDescriptionStyle = typestyle_1.style({
    display: "inline",
    color: "black"
});
var eventDivStyle = typestyle_1.style({
    marginTop: "5px",
    marginBottom: "5px"
});
function redraw() {
    console.log("redraw");
}
function Legend(_a) {
    var filters = _a.filters, eventConfig = _a.eventConfig, iconHeight = _a.iconHeight, iconWidth = _a.iconWidth;
    var eventTypeDescriptions = new Array();
    var transform = "translate(" + iconHeight / 2 + ", " + (iconWidth / 2 - 2.5) + ")";
    if (eventConfig) {
        for (var key in eventConfig) {
            var event_1 = eventConfig[key];
            var eventDiv = react_1.default.createElement("div", { className: eventDivStyle, key: key },
                filters &&
                    react_1.default.createElement("input", { type: "checkbox", id: key + " checkbox", name: key, value: key, onClick: redraw }),
                react_1.default.createElement("svg", { height: iconHeight, width: iconWidth, className: eventIconStyle },
                    react_1.default.createElement("g", { transform: transform }, event_1.backboneGlyph)),
                react_1.default.createElement("p", { className: eventDescriptionStyle }, event_1.description ? event_1.description : "Event description missing"));
            eventTypeDescriptions.push(eventDiv);
        }
    }
    return react_1.default.createElement("div", { id: "Legend", className: legendBorderDivStyle }, eventTypeDescriptions);
}
exports.Legend = Legend;
//# sourceMappingURL=Legend.js.map