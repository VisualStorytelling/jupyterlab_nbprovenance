"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_move_1 = require("react-move");
const semantic_ui_react_1 = require("semantic-ui-react");
const translate_1 = __importDefault(require("../Utils/translate"));
const Styles_1 = require("./Styles");
function BackboneNode({ first, iconOnly, current, node, duration, radius, strokeWidth, textSize, nodeMap, annotationOpen, setAnnotationOpen, exemptList, setExemptList, bundleMap, clusterLabels, eventConfig, popupContent, annotationContent, expandedClusterList, }) {
    const padding = 15;
    let cursorStyle = {
        cursor: "pointer",
    };
    // console.log(JSON.parse(JSON.stringify(node)));
    let glyph = (react_1.default.createElement("circle", { style: cursorStyle, className: Styles_1.treeColor(current), r: radius, strokeWidth: strokeWidth }));
    // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap)
    let dropDownAdded = false;
    if (eventConfig) {
        const eventType = node.metadata.type;
        if (eventType && eventType in eventConfig && eventType !== "Root") {
            const { bundleGlyph, currentGlyph, backboneGlyph } = eventConfig[eventType];
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
    let label = "";
    let annotate = "";
    console.log(bundleMap);
    console.log(nodeMap[node.id]);
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
    if (annotate.length > 30)
        annotate = annotate.substr(0, 30) + "..";
    if (label.length > 30)
        label = label.substr(0, 30) + "..";
    let labelG = (react_1.default.createElement("g", { style: { opacity: 1 }, transform: translate_1.default(padding, 0) },
        !iconOnly ? (react_1.default.createElement("g", null,
            dropDownAdded ? (react_1.default.createElement("text", { style: cursorStyle, onClick: (e) => nodeClicked(node, e), fontSize: 17, fill: "rgb(248, 191, 132)", textAnchor: "middle", alignmentBaseline: "middle", x: 1, y: 0, fontFamily: "FontAwesome" }, expandedClusterList && expandedClusterList.includes(node.id)
                ? "\uf0d8"
                : "\uf0d7")) : (react_1.default.createElement("g", null)),
            react_1.default.createElement("text", { y: annotate.length === 0 ? 0 : -7, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: "bold", onClick: () => labelClicked(node) }, label),
            ",",
            react_1.default.createElement("text", { y: 7, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: "regular", onClick: () => labelClicked(node) }, annotate))) : (react_1.default.createElement("g", null, dropDownAdded ? (react_1.default.createElement("text", { style: cursorStyle, onClick: (e) => nodeClicked(node, e), fontSize: 17, fill: "rgb(248, 191, 132)", textAnchor: "middle", alignmentBaseline: "middle", x: 1, y: 0, fontFamily: "FontAwesome" }, expandedClusterList && expandedClusterList.includes(node.id)
            ? "\uf0d8"
            : "\uf0d7")) : (react_1.default.createElement("g", null)))),
        annotationOpen !== -1 &&
            nodeMap[node.id].depth === annotationOpen &&
            annotationContent ? (react_1.default.createElement("g", null, annotationContent(nodeMap[node.id]))) : (react_1.default.createElement("g", null))));
    return (react_1.default.createElement(react_move_1.Animate, { start: { opacity: 0 }, enter: {
            opacity: [1],
            timing: { duration: 100, delay: first ? 0 : duration },
        } }, (state) => (react_1.default.createElement(react_1.default.Fragment, null,
        popupContent !== undefined && nodeMap[node.id].depth > 0 ? (react_1.default.createElement(semantic_ui_react_1.Popup, { content: popupContent(node), trigger: glyph })) : (glyph),
        popupContent !== undefined && nodeMap[node.id].depth > 0 ? (react_1.default.createElement(semantic_ui_react_1.Popup, { content: popupContent(node), trigger: labelG })) : (labelG)))));
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
            let exemptCopy = Array.from(exemptList);
            if (exemptCopy.includes(node.id)) {
                exemptCopy.splice(exemptCopy.findIndex((d) => d === node.id), 1);
            }
            else {
                exemptCopy.push(node.id);
            }
            setExemptList(exemptCopy);
        }
        event.stopPropagation();
    }
}
exports.default = BackboneNode;
// const Label: FC<{ label: string } & React.SVGProps<SVGTextElement>> = (props: {
//   label: string;
// }) => {
//   return <text {...props}>{props.label}</text>;
// };
//# sourceMappingURL=BackboneNode.js.map