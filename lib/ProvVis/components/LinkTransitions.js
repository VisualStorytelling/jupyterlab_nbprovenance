"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function linkTransitions(xOffset, yOffset, clusterOffset, backboneOffset, duration = 500, nodeList, nodeMap, annotationOpen, annotationHeight, bundleMap) {
    xOffset = -xOffset;
    backboneOffset = -backboneOffset;
    const start = () => {
        return { x1: 0, x2: 0, y1: 0, y2: 0, opacity: 0 };
    };
    const enter = (data) => {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        let clusteredNodesInFront = 0;
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
        const { source, target } = data;
        const x1 = getX(source.width, xOffset, backboneOffset);
        const x2 = getX(target.width, xOffset, backboneOffset);
        let y1 = yOffset * source.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        let y2 = yOffset * target.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && source.depth > annotationOpen && source.width === 0) {
            y1 += annotationHeight;
        }
        if (annotationOpen !== -1 && target.depth > annotationOpen && target.width === 0) {
            y2 += annotationHeight;
        }
        return { x1, x2, y1, y2, opacity: 1, timing: { duration } };
    };
    const update = (data) => {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        let clusteredNodesInFront = 0;
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
        const { source, target } = data;
        const x1 = getX(source.width, xOffset, backboneOffset);
        const x2 = getX(target.width, xOffset, backboneOffset);
        let y1 = yOffset * source.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        let y2 = yOffset * target.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
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
            timing: { duration }
        };
    };
    return { enter, leave: start, update, start };
}
exports.default = linkTransitions;
function getX(width, xOffset, backboneOffset) {
    return width > 1
        ? (xOffset + backboneOffset) * width - backboneOffset
        : (xOffset + backboneOffset) * width;
}
exports.getX = getX;
//# sourceMappingURL=LinkTransitions.js.map