"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findBundleParent_1 = require("../Utils/findBundleParent");
var LinkTransitions_1 = require("./LinkTransitions");
function nodeTransitions(xOffset, yOffset, clusterOffset, backboneOffset, duration, nodeList, nodeMap, annotationOpen, annotationHeight, bundleMap) {
    if (duration === void 0) { duration = 500; }
    xOffset = -xOffset;
    backboneOffset = -backboneOffset;
    var start = function (data) {
        var clusteredNodesInFront = 0;
        var x = LinkTransitions_1.getX(data.width, xOffset, backboneOffset);
        var parentId = undefined;
        var arr = findBundleParent_1.default(data.id, bundleMap).filter(function (d) {
            return nodeMap[d].width === 0;
        });
        if (arr.length > 0) {
            parentId = arr[0];
        }
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        var y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
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
    var enter = function (data) {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        var clusteredNodesInFront = 0;
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
        var x = LinkTransitions_1.getX(data.width, xOffset, backboneOffset);
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        var y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
            y += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opactiy: 1,
            timing: { duration: duration }
        };
    };
    var update = function (data) {
        // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap);
        var clusteredNodesInFront = 0;
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
        var x = LinkTransitions_1.getX(data.width, xOffset, backboneOffset);
        clusteredNodesInFront =
            clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;
        var y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
            y += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opactiy: 1,
            timing: { duration: duration }
        };
    };
    return { enter: enter, leave: start, update: update, start: start };
}
exports.default = nodeTransitions;
//# sourceMappingURL=NodeTransitions.js.map