"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getX = void 0;
function linkTransitions(xOffset, yOffset, clusterOffset, backboneOffset, duration, nodeList, nodeMap, annotationOpen, annotationHeight, bundleMap) {
    if (duration === void 0) { duration = 500; }
    xOffset = -xOffset;
    backboneOffset = -backboneOffset;
    var start = function () {
        return { x1: 0, x2: 0, y1: 0, y2: 0, opacity: 0 };
    };
    var enter = function (data) {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        var clusteredNodesInFront = 0;
        // for (let i = 0; i < nodeList.length; i++) {
        //   if (
        //     data.source.width === 0 &&
        //     data.target.width === 0 &&
        //     nodeList[i].width === 0 &&
        //     nodeList[i].depth <= data.target.depth &&
        //     backboneBundleNodes.includes(nodeList[i].id)
        //   ) {
        //     clusteredNodesInFront++;
        //   }
        // }
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        var source = data.source, target = data.target;
        var x1 = getX(source.width, xOffset, backboneOffset);
        var x2 = getX(target.width, xOffset, backboneOffset);
        var y1 = yOffset * source.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        var y2 = yOffset * target.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && source.depth > annotationOpen && source.width === 0) {
            y1 += annotationHeight;
        }
        if (annotationOpen !== -1 && target.depth > annotationOpen && target.width === 0) {
            y2 += annotationHeight;
        }
        return { x1: x1, x2: x2, y1: y1, y2: y2, opacity: 1, timing: { duration: duration } };
    };
    var update = function (data) {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        var clusteredNodesInFront = 0;
        // for (let i = 0; i < nodeList.length; i++) {
        //   if (
        //     data.source.width === 0 &&
        //     data.target.width === 0 &&
        //     nodeList[i].width === 0 &&
        //     nodeList[i].depth <= data.target.depth &&
        //     backboneBundleNodes.includes(nodeList[i].id)
        //   ) {
        //     clusteredNodesInFront++;
        //   }
        // }
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        var source = data.source, target = data.target;
        var x1 = getX(source.width, xOffset, backboneOffset);
        var x2 = getX(target.width, xOffset, backboneOffset);
        var y1 = yOffset * source.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        var y2 = yOffset * target.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && source.depth > annotationOpen && source.width === 0) {
            y1 += annotationHeight;
        }
        if (annotationOpen !== -1 && target.depth > annotationOpen && target.width === 0) {
            y2 += annotationHeight;
        }
        return {
            x1: [x1],
            y1: [y1],
            x2: [x2],
            y2: [y2],
            opacity: 1,
            timing: { duration: duration }
        };
    };
    return { enter: enter, leave: start, update: update, start: start };
}
exports.default = linkTransitions;
function getX(width, xOffset, backboneOffset) {
    return width > 1
        ? (xOffset + backboneOffset) * width - backboneOffset
        : (xOffset + backboneOffset) * width;
}
exports.getX = getX;
//# sourceMappingURL=LinkTransitions.js.map