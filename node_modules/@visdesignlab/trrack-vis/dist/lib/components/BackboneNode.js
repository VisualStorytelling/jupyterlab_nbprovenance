"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_move_1 = require("react-move");
var semantic_ui_react_1 = require("semantic-ui-react");
var translate_1 = require("../Utils/translate");
var Styles_1 = require("./Styles");
var d3_shape_1 = require("d3-shape");
var typestyle_1 = require("typestyle");
function BackboneNode(_a) {
    var prov = _a.prov, first = _a.first, iconOnly = _a.iconOnly, current = _a.current, node = _a.node, duration = _a.duration, radius = _a.radius, strokeWidth = _a.strokeWidth, textSize = _a.textSize, nodeMap = _a.nodeMap, annotationOpen = _a.annotationOpen, setBookmark = _a.setBookmark, bookmark = _a.bookmark, setAnnotationOpen = _a.setAnnotationOpen, exemptList = _a.exemptList, setExemptList = _a.setExemptList, bundleMap = _a.bundleMap, clusterLabels = _a.clusterLabels, eventConfig = _a.eventConfig, popupContent = _a.popupContent, editAnnotations = _a.editAnnotations, annotationContent = _a.annotationContent, expandedClusterList = _a.expandedClusterList, cellsVisArea = _a.cellsVisArea, _b = _a.yOffset, yOffset = _b === void 0 ? 10 : _b;
    var padding = 15;
    var cursorStyle = {
        cursor: "pointer",
    };
    // console.log(JSON.parse(JSON.stringify(node)));
    var glyph = (react_1.default.createElement("circle", { style: cursorStyle, className: Styles_1.treeColor(current), r: radius, strokeWidth: strokeWidth }));
    // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap)
    var dropDownAdded = false;
    if (eventConfig) {
        var eventType = node.metadata.type;
        if (eventType && eventType in eventConfig && eventType !== "Root") {
            var _c = eventConfig[eventType], bundleGlyph = _c.bundleGlyph, currentGlyph = _c.currentGlyph, backboneGlyph = _c.backboneGlyph;
            if (bundleMap && Object.keys(bundleMap).includes(node.id)) {
                dropDownAdded = true;
                glyph = (react_1.default.createElement("g", { style: cursorStyle, fontWeight: "none" }, bundleGlyph));
            }
            if (current) {
                glyph = (react_1.default.createElement("g", { style: cursorStyle, fontWeight: "none" }, currentGlyph));
            }
            else if (!dropDownAdded) {
                glyph = (react_1.default.createElement("g", { style: cursorStyle, fontWeight: "none" }, backboneGlyph));
            }
        }
    }
    var label = "";
    var annotate = "";
    //console.log(nodeMap[node.id]);
    if (bundleMap && Object.keys(bundleMap).includes(node.id) && node.ephemeral && expandedClusterList && !expandedClusterList.includes(node.id)) {
        if (node.metadata && node.metadata.type) {
            label = "[" + bundleMap[node.id].bunchedNodes.length + "] " + node.metadata.type;
        }
        else {
            label = "[" + bundleMap[node.id].bunchedNodes.length + "]";
        }
    }
    else {
        label = node.label;
    }
    if (node.artifacts && node.artifacts.annotation && node.artifacts.annotation.length > 0) {
        annotate = node.artifacts.annotation;
    }
    if (!nodeMap[node.id]) {
        return null;
    }
    if (annotate.length > 20)
        annotate = annotate.substr(0, 20) + "..";
    if (label.length > 20)
        label = label.substr(0, 20) + "..";
    // text should always be on the right side of the cellsVis
    // @ts-ignore
    if (node.state.model.cells != null) {
        // @ts-ignore
        padding += ((cellsVisArea ? Math.sqrt(cellsVisArea) : Math.sqrt(15)) + 6) * node.state.model.cells.length;
    }
    var labelG = (react_1.default.createElement("g", { style: { opacity: 1 }, transform: translate_1.default(padding, 0) },
        !iconOnly ? (react_1.default.createElement("g", null,
            dropDownAdded ? (react_1.default.createElement("text", { style: cursorStyle, onClick: function (e) { return nodeClicked(node, e); }, fontSize: 17, fill: "rgb(248, 191, 132)", textAnchor: "middle", alignmentBaseline: "middle", x: 1, y: 0, fontFamily: "FontAwesome" }, expandedClusterList && expandedClusterList.includes(node.id)
                ? "\uf0d8"
                : "\uf0d7")) : (react_1.default.createElement("g", null)),
            editAnnotations ? (react_1.default.createElement("button", null,
                react_1.default.createElement("i", { className: "fas fa-undo marginRight" }),
                "Undo")) : (react_1.default.createElement("g", null)),
            react_1.default.createElement("text", { y: annotate.length === 0 ? 0 : -7, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: "bold", onClick: function () { return labelClicked(node); } }, label),
            ",",
            react_1.default.createElement("text", { y: 7, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: "regular", onClick: function () { return labelClicked(node); } }, annotate),
            ",",
            react_1.default.createElement("text", { style: cursorStyle, onClick: function (e) {
                    if (prov) {
                        prov.setBookmark(node.id, !prov.getBookmark(node.id));
                        setBookmark(!bookmark);
                    }
                    e.stopPropagation();
                }, fontSize: 17, fill: (prov && prov.getBookmark(node.id)) ? "#2185d0" : "#cccccc", textAnchor: "middle", alignmentBaseline: "middle", x: 175, y: 0, fontFamily: "FontAwesome" }, "\uf02e"))) : (react_1.default.createElement("g", null, dropDownAdded ? (react_1.default.createElement("text", { style: cursorStyle, onClick: function (e) { return nodeClicked(node, e); }, fontSize: 17, fill: "rgb(248, 191, 132)", textAnchor: "middle", alignmentBaseline: "middle", x: 1, y: 0, fontFamily: "FontAwesome" }, expandedClusterList && expandedClusterList.includes(node.id)
            ? "\uf0d8"
            : "\uf0d7")) : (react_1.default.createElement("g", null)))),
        annotationOpen !== -1 &&
            nodeMap[node.id].depth === annotationOpen &&
            annotationContent ? (react_1.default.createElement("g", null, annotationContent(nodeMap[node.id]))) : (react_1.default.createElement("g", null))));
    return (react_1.default.createElement(react_move_1.Animate, { start: { opacity: 0 }, enter: {
            opacity: [1],
            timing: { duration: 100, delay: first ? 0 : duration },
        } }, function (state) { return (react_1.default.createElement(react_1.default.Fragment, null,
        popupContent !== undefined && nodeMap[node.id].depth > 0 ? (react_1.default.createElement(semantic_ui_react_1.Popup, { content: popupContent(node), trigger: glyph })) : (glyph),
        popupContent !== undefined && nodeMap[node.id].depth > 0 ? (react_1.default.createElement(semantic_ui_react_1.Popup, { content: popupContent(node), trigger: labelG })) : (labelG),
        react_1.default.createElement(CellsVis, null))); }));
    function labelClicked(node) {
        if (!annotationContent) {
            return;
        }
        else if (annotationOpen === nodeMap[node.id].depth) {
            setAnnotationOpen(-1);
        }
        else {
            setAnnotationOpen(nodeMap[node.id].depth);
        }
    }
    function nodeClicked(node, event) {
        if (bundleMap && Object.keys(bundleMap).includes(node.id)) {
            var exemptCopy = Array.from(exemptList);
            if (exemptCopy.includes(node.id)) {
                exemptCopy.splice(exemptCopy.findIndex(function (d) { return d === node.id; }), 1);
            }
            else {
                exemptCopy.push(node.id);
            }
            setExemptList(exemptCopy);
        }
        event.stopPropagation();
    }
    // ------------- np_jupyterlab
    function CellsVis() {
        var cellsVis;
        var squareSideLength = cellsVisArea ? Math.sqrt(cellsVisArea) : Math.sqrt(15);
        var xLength = (squareSideLength + 6);
        // @ts-ignore
        if (node.state.model.cells != null) {
            // @ts-ignore
            var nodeExtra_1 = prov.getExtraFromArtifact(node.id)[0].e;
            // @ts-ignore
            cellsVis = node.state.model.cells.map(function (cell, index) {
                return react_1.default.createElement("g", { key: index, transform: translate_1.default(20 + xLength * index, 0) },
                    react_1.default.createElement("path", { strokeWidth: 2, className: symbolColor(cell, index), d: d3_shape_1.symbol().type(d3_shape_1.symbolSquare).size(cellsVisArea ? cellsVisArea : 15)() }),
                    react_1.default.createElement(CellsLine, { yLength: squareSideLength / 2, xLength: xLength, index: index, nodeExtra: nodeExtra_1 }));
            });
        }
        // @ts-ignore
        if (node.state.model.cells != null) {
            return react_1.default.createElement("g", null, cellsVis);
        }
        return null;
    }
    function CellsLine(_a) {
        var yLength = _a.yLength, xLength = _a.xLength, index = _a.index, nodeExtra = _a.nodeExtra;
        var cellPositions = nodeExtra.cellPositions;
        if (cellPositions != null) { // cell added or moved
            // @ts-ignore
            if (cellPositions.length == node.state.model.cells.length - 1) { // some cell was added
                // @ts-ignore
                if (cellPositions[index] == nodeExtra.changedCellId || cellPositions[index] == undefined) { // this is the new cell, undefined if on rightmost side
                    return null;
                }
            }
            // @ts-ignore
            if (cellPositions.length == node.state.model.cells.length + 1) { // some cell was removed
                if (cellPositions[index] == index) { // this cell didnt change position
                    return react_1.default.createElement("line", { x1: "0", y1: -yLength, x2: "0", y2: -yOffset + yLength, strokeWidth: 2, stroke: "rgb(0,0,0)" });
                }
                else {
                    return react_1.default.createElement("line", { x1: "0", y1: -yLength, x2: 1 * xLength, y2: -yOffset + yLength, strokeWidth: 2, stroke: "rgb(0,0,0)" });
                }
            }
            if (cellPositions[index] == index) { // this cell didnt change position
                return react_1.default.createElement("line", { x1: "0", y1: -yLength, x2: "0", y2: -yOffset + yLength, strokeWidth: 2, stroke: "rgb(0,0,0)" });
            }
            else { // this cell changed position
                return react_1.default.createElement("line", { x1: (cellPositions[index] - index) * xLength, y1: -yLength, x2: "0", y2: -yOffset + yLength, strokeWidth: 2, stroke: "rgb(0,0,0)" });
            }
        }
        // If no cellPositions info exists, then no cell has been added and no cell has been moved ==> just draw a line straight up
        return react_1.default.createElement("line", { x1: "0", y1: -yLength, x2: "0", y2: -yOffset + yLength, strokeWidth: 2, stroke: "rgb(0,0,0)" });
    }
    function symbolColor(cell, index) {
        switch (cell.cell_type) {
            case "code": {
                return typestyle_1.style({
                    // @ts-ignore
                    fill: prov.getExtraFromArtifact(node.id)[0].e.changedCellId == index ? 'rgb(150, 22, 22)' : 'white',
                    stroke: 'rgb(150, 22, 22)'
                });
                break;
            }
            case "markdown": {
                return typestyle_1.style({
                    // @ts-ignore
                    fill: prov.getExtraFromArtifact(node.id)[0].e.changedCellId == index ? 'rgb(22, 150, 22)' : 'white',
                    stroke: 'rgb(22, 150, 22)'
                });
                break;
            }
            case "raw": {
                return typestyle_1.style({
                    // @ts-ignore
                    fill: prov.getExtraFromArtifact(node.id)[0].e.changedCellId == index ? 'rgb(22, 22, 150)' : 'white',
                    stroke: 'rgb(22, 22, 150)'
                });
                break;
            }
        }
    }
}
exports.default = BackboneNode;
//# sourceMappingURL=BackboneNode.js.map