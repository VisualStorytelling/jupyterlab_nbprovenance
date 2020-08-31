"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const provenance_lib_core_1 = require("@visdesignlab/provenance-lib-core");
const d3_1 = require("d3");
const react_1 = __importStar(require("react"));
const react_move_1 = require("react-move");
const semantic_ui_react_1 = require("semantic-ui-react");
const typestyle_1 = require("typestyle");
const findBundleParent_1 = __importDefault(require("../Utils/findBundleParent"));
const translate_1 = __importDefault(require("../Utils/translate"));
const UndoRedoButton_1 = __importDefault(require("./UndoRedoButton"));
const TreeLayout_1 = require("../Utils/TreeLayout");
const BackboneNode_1 = __importDefault(require("./BackboneNode"));
const BundleTransitions_1 = __importDefault(require("./BundleTransitions"));
const Link_1 = __importDefault(require("./Link"));
const LinkTransitions_1 = __importDefault(require("./LinkTransitions"));
const NodeTransitions_1 = __importDefault(require("./NodeTransitions"));
const Styles_1 = require("./Styles");
function ProvVis({ nodeMap, root, current, changeCurrent, width = 1500, height = 2000, iconOnly = false, gutter = 15, backboneGutter = 20, verticalSpace = 50, annotationHeight = 100, clusterVerticalSpace = 50, regularCircleRadius = 4, backboneCircleRadius = 5, regularCircleStroke = 3, backboneCircleStroke = 3, sideOffset = 200, topOffset = 30, textSize = 15, linkWidth = 4, duration = 600, clusterLabels = true, bundleMap = {}, eventConfig, popupContent, annotationContent, undoRedoButtons = true, prov, ephemeralUndo = false }) {
    const [first, setFirst] = react_1.useState(true);
    const [annotationOpen, setAnnotationOpen] = react_1.useState(-1);
    let list = [];
    let eventTypes = new Set();
    for (let j in nodeMap) {
        let child = nodeMap[j];
        if (provenance_lib_core_1.isChildNode(child)) {
            if (child.metadata.type) {
                eventTypes.add(child.metadata.type);
            }
            if (child.ephemeral && child.children.length == 1 && (!nodeMap[child.parent].ephemeral || nodeMap[child.parent].children.length > 1)) {
                let group = [];
                let curr = child;
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
        list = list.concat(Object.keys(bundleMap).filter(d => bundleMap[d].metadata && bundleMap[d].metadata.includes(d)));
    }
    function setDefaultConfig(types) {
        let symbols = [
            d3_1.symbol().type(d3_1.symbolStar).size(50),
            d3_1.symbol().type(d3_1.symbolDiamond),
            d3_1.symbol().type(d3_1.symbolTriangle),
            d3_1.symbol().type(d3_1.symbolCircle),
            d3_1.symbol().type(d3_1.symbolCross),
            d3_1.symbol().type(d3_1.symbolSquare),
            d3_1.symbol().type(d3_1.symbolWye)
        ];
        // Find nodes in the clusters whose entire cluster is on the backbone.
        let conf = {};
        let counter = 0;
        for (let j of types) {
            conf[j] = {};
            conf[j].backboneGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(false), d: symbols[counter]() }));
            conf[j].bundleGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(false), d: symbols[counter]() }));
            conf[j].currentGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(true), d: symbols[counter]() }));
            conf[j].regularGlyph = (react_1.default.createElement("path", { strokeWidth: 2, className: Styles_1.treeColor(false), d: symbols[counter]() }));
            counter++;
        }
        return conf;
    }
    const [expandedClusterList, setExpandedClusterList] = react_1.useState(list);
    if (!eventConfig && eventTypes.size > 0 && eventTypes.size < 8) {
        eventConfig = setDefaultConfig(eventTypes);
    }
    react_1.useEffect(() => {
        setFirst(false);
    }, []);
    let nodeList = Object.values(nodeMap).filter((d) => true);
    let copyList = Array.from(nodeList);
    const keys = bundleMap ? Object.keys(bundleMap) : [];
    //Find a list of all nodes included in a bundle.
    let bundledNodes = [];
    if (bundleMap) {
        for (let key of keys) {
            bundledNodes = bundledNodes.concat(bundleMap[key].bunchedNodes);
            bundledNodes.push(key);
        }
    }
    const strat = d3_1.stratify()
        .id((d) => d.id)
        .parentId((d) => {
        if (d.id === root)
            return null;
        if (provenance_lib_core_1.isChildNode(d)) {
            //If you are a unexpanded bundle, find your parent by going straight up.
            if (bundleMap &&
                Object.keys(bundleMap).includes(d.id) &&
                !expandedClusterList.includes(d.id)) {
                let curr = d;
                while (true) {
                    //need this to remove linter warning.
                    let localCurr = curr;
                    // let bundlePar = findBundleParent(curr.parent, bundleMap);
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
                        Object.keys(bundleMap).includes(localCurr.parent)) {
                        return localCurr.parent;
                    }
                    let temp = copyList.filter(function (d) {
                        return d.id === localCurr.parent;
                    })[0];
                    if (provenance_lib_core_1.isChildNode(temp)) {
                        curr = temp;
                    }
                }
            }
            let bundleParents = findBundleParent_1.default(d.parent, bundleMap);
            let collapsedParent = undefined;
            let allExpanded = true;
            for (let j in bundleParents) {
                if (!expandedClusterList.includes(bundleParents[j])) {
                    allExpanded = false;
                    collapsedParent = bundleParents[j];
                    break;
                }
            }
            if (bundledNodes.includes(d.parent) &&
                bundleMap &&
                !Object.keys(bundleMap).includes(d.parent) &&
                !allExpanded) {
                return collapsedParent;
            }
            return d.parent;
        }
        else {
            return null;
        }
    });
    for (let i = 0; i < nodeList.length; i++) {
        let bundleParents = findBundleParent_1.default(nodeList[i].id, bundleMap);
        let allExpanded = true;
        for (let j in bundleParents) {
            if (!expandedClusterList.includes(bundleParents[j])) {
                allExpanded = false;
                break;
            }
        }
        if (bundledNodes.includes(nodeList[i].id) &&
            !allExpanded &&
            bundleMap &&
            !Object.keys(bundleMap).includes(nodeList[i].id)) {
            nodeList.splice(i, 1);
            i--;
        }
    }
    const stratifiedTree = strat(nodeList);
    // //console.log(JSON.parse(JSON.stringify(stratifiedTree)));
    const stratifiedList = stratifiedTree.descendants();
    const stratifiedMap = {};
    stratifiedList.forEach((c) => (stratifiedMap[c.id] = c));
    TreeLayout_1.treeLayout(stratifiedMap, current, root);
    let maxHeight = 0;
    let maxWidth = 0;
    for (let j in stratifiedList) {
        if (stratifiedList[j].depth > maxHeight) {
            maxHeight = stratifiedList[j].depth;
        }
        if (stratifiedList[j].width > maxWidth) {
            maxWidth = stratifiedList[j].width;
        }
    }
    const links = stratifiedTree.links();
    const xOffset = gutter;
    const yOffset = verticalSpace;
    function regularGlyph(node) {
        if (eventConfig) {
            const eventType = node.metadata.type;
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
            const eventType = node.metadata.type;
            if (eventType && eventType in eventConfig && eventType !== "Root") {
                return eventConfig[eventType].bundleGlyph;
            }
        }
        return (react_1.default.createElement("circle", { r: regularCircleRadius, strokeWidth: regularCircleStroke, className: Styles_1.treeColor(false) }));
    }
    let shiftLeft = 0;
    if (maxWidth === 0) {
        shiftLeft = 30;
    }
    else if (maxWidth === 1) {
        shiftLeft = 52;
    }
    else if (maxWidth > 1) {
        shiftLeft = 74;
    }
    let svgWidth = width;
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
    let overflowStyle = {
        overflowX: "auto",
        overflowY: "auto",
    };
    return (react_1.default.createElement("div", { style: overflowStyle, className: container, id: "prov-vis" },
        react_1.default.createElement("div", { id: "undoRedoDiv" },
            react_1.default.createElement(UndoRedoButton_1.default, { graph: prov ? prov.graph() : undefined, undoCallback: () => {
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
                }, redoCallback: () => {
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
        react_1.default.createElement("svg", { style: { overflow: "visible" }, id: "topSvg", height: maxHeight < height ? height : maxHeight, width: svgWidth },
            react_1.default.createElement("rect", { height: height, width: width, fill: "none", stroke: "none" }),
            react_1.default.createElement("g", { id: "globalG", transform: translate_1.default(shiftLeft, topOffset) },
                react_1.default.createElement(react_move_1.NodeGroup, Object.assign({ data: links, keyAccessor: (link) => `${link.source.id}${link.target.id}` }, LinkTransitions_1.default(xOffset, yOffset, clusterVerticalSpace, backboneGutter - gutter, duration, stratifiedList, stratifiedMap, annotationOpen, annotationHeight, bundleMap)), (linkArr) => (react_1.default.createElement(react_1.default.Fragment, null, linkArr.map((link) => {
                    const { key, state } = link;
                    return (react_1.default.createElement("g", { key: key },
                        react_1.default.createElement(Link_1.default, Object.assign({}, state, { fill: '#ccc', stroke: '#ccc', strokeWidth: linkWidth }))));
                })))),
                react_1.default.createElement(react_move_1.NodeGroup, Object.assign({ data: stratifiedList, keyAccessor: (d) => d.id }, NodeTransitions_1.default(xOffset, yOffset, clusterVerticalSpace, backboneGutter - gutter, duration, stratifiedList, stratifiedMap, annotationOpen, annotationHeight, bundleMap)), (nodes) => {
                    return (react_1.default.createElement(react_1.default.Fragment, null, nodes.map((node) => {
                        const { data: d, key, state } = node;
                        const popupTrigger = (react_1.default.createElement("g", { key: key, onClick: () => {
                                if (changeCurrent) {
                                    changeCurrent(d.id);
                                }
                            }, transform: d.width === 0
                                ? translate_1.default(state.x, state.y)
                                : translate_1.default(state.x, state.y) }, d.width === 0 ? (react_1.default.createElement(BackboneNode_1.default, { textSize: textSize, iconOnly: iconOnly, radius: backboneCircleRadius, strokeWidth: backboneCircleStroke, duration: duration, first: first, current: current === d.id, node: d.data, bundleMap: bundleMap, nodeMap: stratifiedMap, clusterLabels: clusterLabels, annotationOpen: annotationOpen, setAnnotationOpen: setAnnotationOpen, exemptList: expandedClusterList, setExemptList: setExpandedClusterList, eventConfig: eventConfig, annotationContent: annotationContent, popupContent: popupContent, expandedClusterList: expandedClusterList })) : popupContent !== undefined ? (react_1.default.createElement(semantic_ui_react_1.Popup, { content: popupContent(d.data), trigger: react_1.default.createElement("g", { onClick: () => {
                                    setAnnotationOpen(-1);
                                } }, keys.includes(d.id)
                                ? bundleGlyph(d.data)
                                : regularGlyph(d.data)) })) : (react_1.default.createElement("g", { onClick: () => {
                                setAnnotationOpen(-1);
                            } }, regularGlyph(d.data)))));
                        return popupTrigger;
                    })));
                }),
                react_1.default.createElement(react_move_1.NodeGroup, Object.assign({ data: keys, keyAccessor: (key) => `${key}` }, BundleTransitions_1.default(xOffset, verticalSpace, clusterVerticalSpace, backboneGutter - gutter, duration, expandedClusterList, stratifiedMap, stratifiedList, annotationOpen, annotationHeight, bundleMap)), (bundle) => (react_1.default.createElement(react_1.default.Fragment, null, bundle.map((b) => {
                    const { key, state } = b;
                    if (bundleMap === undefined ||
                        stratifiedMap[b.key].width !== 0 ||
                        state.validity === false) {
                        return null;
                    }
                    return (react_1.default.createElement("g", { key: key, transform: translate_1.default(state.x - gutter + 5, state.y - clusterVerticalSpace / 2) },
                        react_1.default.createElement("rect", { style: { opacity: state.opacity }, width: iconOnly ? 42 : sideOffset - 15, height: state.height, rx: "10", ry: "10", fill: "none", strokeWidth: "2px", stroke: "rgb(248, 191, 132)" })));
                }))))))));
}
exports.default = ProvVis;
const container = typestyle_1.style({
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
});
//# sourceMappingURL=ProvVis.js.map