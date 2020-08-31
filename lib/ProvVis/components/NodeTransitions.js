"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findBundleParent_1 = __importDefault(require("../Utils/findBundleParent"));
const LinkTransitions_1 = require("./LinkTransitions");
function nodeTransitions(xOffset, yOffset, clusterOffset, backboneOffset, duration = 500, nodeList, nodeMap, annotationOpen, annotationHeight, bundleMap) {
    xOffset = -xOffset;
    backboneOffset = -backboneOffset;
    const start = (data) => {
        let clusteredNodesInFront = 0;
        const x = LinkTransitions_1.getX(data.width, xOffset, backboneOffset);
        let parentId = undefined;
        let arr = findBundleParent_1.default(data.id, bundleMap).filter(d => {
            return nodeMap[d].width === 0;
        });
        if (arr.length > 0) {
            parentId = arr[0];
        }
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (parentId !== undefined && bundleMap && !Object.keys(bundleMap).includes(data.id)) {
            y =
                yOffset * (nodeMap[parentId].depth - bundleMap[parentId].bunchedNodes.length + 2) -
                    (yOffset - clusterOffset) * clusteredNodesInFront;
        }
        if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
            y += annotationHeight;
        }
        return { x: x, y: y - yOffset, opacity: 0 };
    };
    const enter = (data) => {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        let clusteredNodesInFront = 0;
        // for (let i = 0; i < nodeList.length; i++) {
        //   if (
        //     data.width === 0 &&
        //     nodeList[i].width === 0 &&
        //     nodeList[i].depth <= data.depth &&
        //     backboneBundleNodes.includes(nodeList[i].id)
        //   ) {
        //     clusteredNodesInFront++;
        //   }
        // }
        const x = LinkTransitions_1.getX(data.width, xOffset, backboneOffset);
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
            y += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opactiy: 1,
            timing: { duration }
        };
    };
    const update = (data) => {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        let clusteredNodesInFront = 0;
        // for (let i = 0; i < nodeList.length; i++) {
        //   if (
        //     data.width === 0 &&
        //     nodeList[i].width === 0 &&
        //     nodeList[i].depth <= data.depth &&
        //     backboneBundleNodes.includes(nodeList[i].id)
        //   ) {
        //     clusteredNodesInFront++;
        //   }
        // }
        const x = LinkTransitions_1.getX(data.width, xOffset, backboneOffset);
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
            y += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opactiy: 1,
            timing: { duration }
        };
    };
    return { enter, leave: start, update, start };
}
exports.default = nodeTransitions;
//# sourceMappingURL=NodeTransitions.js.map