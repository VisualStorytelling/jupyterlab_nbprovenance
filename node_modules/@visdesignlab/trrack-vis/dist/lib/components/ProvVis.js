"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var trrack_1 = require("@visdesignlab/trrack");
var d3_1 = require("d3");
var react_1 = require("react");
var react_move_1 = require("react-move");
var semantic_ui_react_1 = require("semantic-ui-react");
var typestyle_1 = require("typestyle");
var findBundleParent_1 = require("../Utils/findBundleParent");
var translate_1 = require("../Utils/translate");
var UndoRedoButton_1 = require("./UndoRedoButton");
var TreeLayout_1 = require("../Utils/TreeLayout");
var BackboneNode_1 = require("./BackboneNode");
var BundleTransitions_1 = require("./BundleTransitions");
var Link_1 = require("./Link");
var LinkTransitions_1 = require("./LinkTransitions");
var NodeTransitions_1 = require("./NodeTransitions");
var Styles_1 = require("./Styles");
var Legend_1 = require("./Legend");
function ProvVis(_a) {
    var e_1, _b;
    var nodeMap = _a.nodeMap, root = _a.root, current = _a.current, changeCurrent = _a.changeCurrent, _c = _a.width, width = _c === void 0 ? 1500 : _c, _d = _a.height, height = _d === void 0 ? 2000 : _d, _e = _a.iconOnly, iconOnly = _e === void 0 ? false : _e, _f = _a.gutter, gutter = _f === void 0 ? 15 : _f, _g = _a.backboneGutter, backboneGutter = _g === void 0 ? 20 : _g, _h = _a.verticalSpace, verticalSpace = _h === void 0 ? 50 : _h, _j = _a.annotationHeight, annotationHeight = _j === void 0 ? 100 : _j, _k = _a.clusterVerticalSpace, clusterVerticalSpace = _k === void 0 ? 50 : _k, _l = _a.regularCircleRadius, regularCircleRadius = _l === void 0 ? 4 : _l, _m = _a.backboneCircleRadius, backboneCircleRadius = _m === void 0 ? 5 : _m, _o = _a.regularCircleStroke, regularCircleStroke = _o === void 0 ? 3 : _o, _p = _a.backboneCircleStroke, backboneCircleStroke = _p === void 0 ? 3 : _p, _q = _a.sideOffset, sideOffset = _q === void 0 ? 200 : _q, _r = _a.topOffset, topOffset = _r === void 0 ? 30 : _r, _s = _a.textSize, textSize = _s === void 0 ? 15 : _s, _t = _a.linkWidth, linkWidth = _t === void 0 ? 4 : _t, _u = _a.duration, duration = _u === void 0 ? 600 : _u, _v = _a.clusterLabels, clusterLabels = _v === void 0 ? true : _v, _w = _a.bundleMap, bundleMap = _w === void 0 ? {} : _w, eventConfig = _a.eventConfig, popupContent = _a.popupContent, annotationContent = _a.annotationContent, _x = _a.editAnnotations, editAnnotations = _x === void 0 ? false : _x, _y = _a.undoRedoButtons, undoRedoButtons = _y === void 0 ? true : _y, prov = _a.prov, _z = _a.ephemeralUndo, ephemeralUndo = _z === void 0 ? false : _z, _0 = _a.cellsVisArea, cellsVisArea = _0 === void 0 ? 50 : _0, _1 = _a.legend, legend = _1 === void 0 ? false : _1, _2 = _a.filters, filters = _2 === void 0 ? false : _2;
    var _3 = __read(react_1.useState(true), 2), first = _3[0], setFirst = _3[1];
    var _4 = __read(react_1.useState(false), 2), bookmark = _4[0], setBookmark = _4[1];
    var _5 = __read(react_1.useState(-1), 2), annotationOpen = _5[0], setAnnotationOpen = _5[1];
    var list = [];
    var eventTypes = new Set();
    for (var j in nodeMap) {
        var child = nodeMap[j];
        if (trrack_1.isChildNode(child)) {
            if (child.metadata.type) {
                eventTypes.add(child.metadata.type);
            }
            if (child.ephemeral && child.children.length == 1 && (!nodeMap[child.parent].ephemeral || nodeMap[child.parent].children.length > 1)) {
                var group = [];
                var curr = child;
                while (curr.ephemeral) {
                    group.push(curr.id);
                    if (curr.children.length === 1 && nodeMap[curr.children[0]].ephemeral) {
                        curr = nodeMap[curr.children[0]];
                    }
                    else {
                        break;
                    }
                }
                bundleMap[child.id] = {
                    metadata: "",
                    bundleLabel: "",
                    bunchedNodes: group
                };
            }
        }
    }
    if (bundleMap) {
        list = list.concat(Object.keys(bundleMap));
    }
    function setDefaultConfig(types) {
        var e_2, _a;
        var symbols = [
            d3_1.symbol().type(d3_1.symbolStar).size(50),
            d3_1.symbol().type(d3_1.symbolDiamond),
            d3_1.symbol().type(d3_1.symbolTriangle),
            d3_1.symbol().type(d3_1.symbolCircle),
            d3_1.symbol().type(d3_1.symbolCross),
            d3_1.symbol().type(d3_1.symbolSquare),
            d3_1.symbol().type(d3_1.symbolWye)
        ];
        // Find nodes in the clusters whose entire cluster is on the backbone.
        var conf = {};
        var counter = 0;
        try {
            for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
                var j = types_1_1.value;
                conf[j] = {};
                conf[j].backboneGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(false), d: symbols[counter]() }));
                conf[j].bundleGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(false), d: symbols[counter]() }));
                conf[j].currentGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(true), d: symbols[counter]() }));
                conf[j].regularGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(false), d: symbols[counter]() }));
                counter++;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (types_1_1 && !types_1_1.done && (_a = types_1.return)) _a.call(types_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return conf;
    }
    var _6 = __read(react_1.useState(Object.keys(bundleMap)), 2), expandedClusterList = _6[0], setExpandedClusterList = _6[1];
    if (!eventConfig && eventTypes.size > 0 && eventTypes.size < 8) {
        eventConfig = setDefaultConfig(eventTypes);
    }
    react_1.useEffect(function () {
        setFirst(false);
    }, []);
    // Apply user filters:
    var typeFilters = new Array();
    eventTypes.forEach(function (type) {
        var id = type + " checkbox";
        var checkbox = document.getElementById(id);
        // @ts-ignore
        if (checkbox && checkbox.checked) {
            typeFilters.push(type);
        }
    });
    var removeList = [];
    recursiveRemoveFiltered(nodeMap[root]);
    // Go through the whole tree and remove nodes that have been filtered out by user settings.
    function recursiveRemoveFiltered(node, parentNode) {
        // node that needs to be removed:
        if (trrack_1.isChildNode(node) && node.metadata && node.metadata.type && typeFilters.includes(node.metadata.type)) {
            // remove the node from the parents children and from the nodeList
            if (node.parent && parentNode && parentNode.children) {
                // remove from parent if exists there
                if (parentNode.children.includes(node.id)) {
                    parentNode.children.splice(parentNode.children.indexOf(node.id), 1);
                }
                // remove from nodeList... this is done with the filter methode when initialising nodeList later on, but here I set the condition
                removeList.push(node.id);
            }
            node.children.forEach(function (n) {
                var child = nodeMap[n];
                if (trrack_1.isChildNode(node) && node.parent && parentNode && parentNode.children) {
                    if (trrack_1.isChildNode(child)) { // for sure it is a child, but I check here because typescript does not know
                        child.parent = parentNode.id;
                    }
                    // parentNode.children.push(n)
                    recursiveRemoveFiltered(child, parentNode); // the parent stays the parent of this node, since this one is removed
                }
            });
        }
        else { // node that will not be removed
            // if node was already child of parentNode: no problem, if not: add it
            if (parentNode && !parentNode.children.includes(node.id)) {
                parentNode.children.push(node.id);
            }
            if (node.children) {
                node.children.forEach(function (n) {
                    var child = nodeMap[n];
                    recursiveRemoveFiltered(child, node); // the parent is THIS node, not the parent node of this node
                });
            }
        }
    }
    var nodeList = Object.values(nodeMap).filter(function (d) { return !removeList.includes(d.id); });
    var filteredBundleMap = {};
    for (var key in bundleMap) {
        if (!removeList.includes(key)) {
            filteredBundleMap[key] = bundleMap[key];
        }
    }
    var copyList = Array.from(nodeList);
    var keys = filteredBundleMap ? Object.keys(filteredBundleMap) : [];
    //Find a list of all nodes included in a bundle.
    var bundledNodes = [];
    if (filteredBundleMap) {
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                bundledNodes = bundledNodes.concat(filteredBundleMap[key].bunchedNodes);
                bundledNodes.push(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_b = keys_1.return)) _b.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    var strat = d3_1.stratify()
        .id(function (d) { return d.id; })
        .parentId(function (d) {
        if (d.id === root)
            return null;
        if (trrack_1.isChildNode(d)) {
            //If you are a unexpanded bundle, find your parent by going straight up.
            if (filteredBundleMap &&
                Object.keys(filteredBundleMap).includes(d.id) &&
                !expandedClusterList.includes(d.id)) {
                var curr = d;
                var _loop_1 = function () {
                    //need this to remove linter warning.
                    var localCurr = curr;
                    // let bundlePar = findBundleParent(curr.parent, filteredBundleMap);
                    // if(bundlePar.length > 0)
                    // {
                    //   for(let j in bundlePar)
                    //   {
                    //     if(bundlePar[j] != d.id && !expandedClusterList.includes(bundlePar[j]))
                    //     {
                    //       return bundlePar[j];
                    //     }
                    //   }
                    // }
                    if (!bundledNodes.includes(localCurr.parent) ||
                        Object.keys(filteredBundleMap).includes(localCurr.parent)) {
                        return { value: localCurr.parent };
                    }
                    var temp = copyList.filter(function (d) {
                        return d.id === localCurr.parent;
                    })[0];
                    if (trrack_1.isChildNode(temp)) {
                        curr = temp;
                    }
                };
                while (true) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            var bundleParents = findBundleParent_1.default(d.parent, filteredBundleMap);
            var collapsedParent = undefined;
            var allExpanded = true;
            for (var j in bundleParents) {
                if (!expandedClusterList.includes(bundleParents[j])) {
                    allExpanded = false;
                    collapsedParent = bundleParents[j];
                    break;
                }
            }
            if (bundledNodes.includes(d.parent) &&
                filteredBundleMap &&
                !Object.keys(filteredBundleMap).includes(d.parent) &&
                !allExpanded) {
                return collapsedParent;
            }
            return d.parent;
        }
        else {
            return null;
        }
    });
    for (var i = 0; i < nodeList.length; i++) {
        var bundleParents = findBundleParent_1.default(nodeList[i].id, filteredBundleMap);
        var allExpanded = true;
        for (var j in bundleParents) {
            if (!expandedClusterList.includes(bundleParents[j])) {
                allExpanded = false;
                break;
            }
        }
        if (bundledNodes.includes(nodeList[i].id) &&
            !allExpanded &&
            filteredBundleMap &&
            !Object.keys(filteredBundleMap).includes(nodeList[i].id)) {
            nodeList.splice(i, 1);
            i--;
        }
    }
    var stratifiedTree = strat(nodeList);
    var stratifiedList = stratifiedTree.descendants();
    var stratifiedMap = {};
    stratifiedList.forEach(function (c) { return (stratifiedMap[c.id] = c); });
    TreeLayout_1.treeLayout(stratifiedMap, current, root);
    var maxHeight = 0;
    var maxWidth = 0;
    for (var j in stratifiedList) {
        if (stratifiedList[j].depth > maxHeight) {
            maxHeight = stratifiedList[j].depth;
        }
        if (stratifiedList[j].width > maxWidth) {
            maxWidth = stratifiedList[j].width;
        }
    }
    maxHeight = maxHeight * verticalSpace + 200;
    var links = stratifiedTree.links();
    var xOffset = gutter;
    var yOffset = verticalSpace;
    function regularGlyph(node) {
        if (eventConfig) {
            var eventType = node.metadata.type;
            if (eventType &&
                eventType in eventConfig &&
                eventType !== "Root" &&
                eventConfig[eventType].regularGlyph) {
                return eventConfig[eventType].regularGlyph;
            }
        }
        return (react_1.default.createElement("circle", { r: regularCircleRadius, strokeWidth: regularCircleStroke, className: Styles_1.treeColor(false) }));
    }
    function bundleGlyph(node) {
        if (eventConfig) {
            var eventType = node.metadata.type;
            if (eventType && eventType in eventConfig && eventType !== "Root") {
                return eventConfig[eventType].bundleGlyph;
            }
        }
        return (react_1.default.createElement("circle", { r: regularCircleRadius, strokeWidth: regularCircleStroke, className: Styles_1.treeColor(false) }));
    }
    var shiftLeft = 0;
    // if (maxWidth === 0) {
    //   shiftLeft = 30;
    // } else if (maxWidth === 1) {
    //   shiftLeft = 52;
    // }
    // else if (maxWidth > 1) {
    //   shiftLeft = 74;
    // }
    if (maxWidth === 0) {
        shiftLeft = 30;
    }
    else {
        shiftLeft = 30 + maxWidth * 22;
    }
    var svgWidth = width;
    // if (document.getElementById("globalG") !== null) {
    //   if (
    //     document
    //       .getElementById("globalG")!
    //       .getBoundingClientRect()
    //       .width.valueOf() > svgWidth
    //   ) {
    //     console.log("in here");
    //     svgWidth =
    //       document
    //         .getElementById("globalG")!
    //         .getBoundingClientRect()
    //         .width.valueOf() + 10;
    //   }
    // }
    var overflowStyle = {
        overflowX: "auto",
        overflowY: "auto",
    };
    var undoRedoStickyStyle = {
        position: "sticky",
        top: 0
    };
    // let bundleRectPadding = (cellsVisArea ? Math.sqrt(cellsVisArea) : Math.sqrt(15)) * maxNumberOfCells; // the rectangular for the bundled nodes needs to be bigger because of the cells
    var cellsBundlePadding = (cellsVisArea ? Math.sqrt(cellsVisArea) : Math.sqrt(15)) + 6;
    return (react_1.default.createElement("div", null,
        legend &&
            react_1.default.createElement(Legend_1.Legend, { filters: filters, eventConfig: eventConfig, iconHeight: 25, iconWidth: 25 }),
        react_1.default.createElement("div", { id: "undoRedoDiv", style: undoRedoStickyStyle },
            react_1.default.createElement(UndoRedoButton_1.default, { graph: prov ? prov.graph() : undefined, undoCallback: function () {
                    if (prov) {
                        if (ephemeralUndo) {
                            prov.goBackToNonEphemeral();
                        }
                        else {
                            prov.goBackOneStep();
                        }
                    }
                    else {
                        return;
                    }
                }, redoCallback: function () {
                    if (prov) {
                        if (ephemeralUndo) {
                            prov.goForwardToNonEphemeral();
                        }
                        else {
                            prov.goForwardOneStep();
                        }
                    }
                    else {
                        return;
                    }
                } })),
        react_1.default.createElement("div", { style: overflowStyle, className: container, id: "prov-vis" },
            react_1.default.createElement("svg", { style: { overflow: "visible" }, id: "topSvg", height: maxHeight < height ? height : maxHeight, width: svgWidth },
                react_1.default.createElement("rect", { height: height, width: width, fill: "none", stroke: "none" }),
                react_1.default.createElement("g", { id: "globalG", transform: translate_1.default(shiftLeft, topOffset) },
                    react_1.default.createElement(react_move_1.NodeGroup, __assign({ data: links, keyAccessor: function (link) { return "" + link.source.id + link.target.id; } }, LinkTransitions_1.default(xOffset, yOffset, clusterVerticalSpace, backboneGutter - gutter, duration, stratifiedList, stratifiedMap, annotationOpen, annotationHeight, filteredBundleMap)), function (linkArr) { return (react_1.default.createElement(react_1.default.Fragment, null, linkArr.map(function (link) {
                        var key = link.key, state = link.state;
                        // console.log(linkArr);
                        return (react_1.default.createElement("g", { key: key },
                            react_1.default.createElement(Link_1.default, __assign({}, state, { fill: '#ccc', stroke: '#ccc', strokeWidth: linkWidth }))));
                    }))); }),
                    react_1.default.createElement(react_move_1.NodeGroup, __assign({ data: stratifiedList, keyAccessor: function (d) { return d.id; } }, NodeTransitions_1.default(xOffset, yOffset, clusterVerticalSpace, backboneGutter - gutter, duration, stratifiedList, stratifiedMap, annotationOpen, annotationHeight, filteredBundleMap)), function (nodes) {
                        return (react_1.default.createElement(react_1.default.Fragment, null, nodes.map(function (node) {
                            var d = node.data, key = node.key, state = node.state;
                            var popupTrigger = (react_1.default.createElement("g", { key: key, onClick: function () {
                                    if (changeCurrent) {
                                        changeCurrent(d.id);
                                    }
                                }, transform: d.width === 0
                                    ? translate_1.default(state.x, state.y)
                                    : translate_1.default(state.x, state.y) }, d.width === 0 ? (react_1.default.createElement(BackboneNode_1.default, { prov: prov, textSize: textSize, iconOnly: iconOnly, radius: backboneCircleRadius, strokeWidth: backboneCircleStroke, duration: duration, first: first, current: current === d.id, node: d.data, setBookmark: setBookmark, bookmark: bookmark, bundleMap: filteredBundleMap, nodeMap: stratifiedMap, clusterLabels: clusterLabels, annotationOpen: annotationOpen, setAnnotationOpen: setAnnotationOpen, exemptList: expandedClusterList, editAnnotations: editAnnotations, setExemptList: setExpandedClusterList, eventConfig: eventConfig, annotationContent: annotationContent, popupContent: popupContent, expandedClusterList: expandedClusterList, cellsVisArea: cellsVisArea, yOffset: yOffset })) : popupContent !== undefined ? (react_1.default.createElement(semantic_ui_react_1.Popup, { content: popupContent(d.data), trigger: react_1.default.createElement("g", { onClick: function () {
                                        setAnnotationOpen(-1);
                                    } }, keys.includes(d.id)
                                    ? bundleGlyph(d.data)
                                    : regularGlyph(d.data)) })) : (react_1.default.createElement("g", { onClick: function () {
                                    setAnnotationOpen(-1);
                                } }, regularGlyph(d.data)))));
                            return popupTrigger;
                        })));
                    }),
                    react_1.default.createElement(react_move_1.NodeGroup, __assign({ data: keys, keyAccessor: function (key) { return "" + key; } }, BundleTransitions_1.default(xOffset, verticalSpace, clusterVerticalSpace, backboneGutter - gutter, duration, expandedClusterList, stratifiedMap, stratifiedList, annotationOpen, annotationHeight, filteredBundleMap)), function (bundle) { return (react_1.default.createElement(react_1.default.Fragment, null, bundle.map(function (b) {
                        var key = b.key, state = b.state;
                        if (filteredBundleMap === undefined ||
                            stratifiedMap[b.key] === undefined ||
                            stratifiedMap[b.key].width !== 0 ||
                            state.validity === false) {
                            return null;
                        }
                        // @ts-ignore
                        var bundleRectPadding = stratifiedMap[b.key].data.state.model.cells.length * cellsBundlePadding;
                        return (react_1.default.createElement("g", { key: key, transform: translate_1.default(state.x - gutter + 5, state.y - clusterVerticalSpace / 2) },
                            react_1.default.createElement("rect", { style: { opacity: state.opacity }, width: (iconOnly ? 42 : sideOffset - 15) + bundleRectPadding + 5, height: state.height, rx: "10", ry: "10", fill: "none", strokeWidth: "2px", stroke: "rgb(248, 191, 132)" })));
                    }))); }))))));
}
exports.default = ProvVis;
var container = typestyle_1.style({
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
});
//# sourceMappingURL=ProvVis.js.map