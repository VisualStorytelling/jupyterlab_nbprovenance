"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkTransitions_1 = require("./LinkTransitions");
function bundleTransitions(xOffset, yOffset, clusterOffset, backboneOffset, duration, expandedClusterList, stratifiedMap, nodeList, annotationOpen, annotationHeight, bundleMap) {
    if (duration === void 0) { duration = 500; }
    xOffset = -xOffset;
    backboneOffset = -backboneOffset;
    var start = function () {
        return { x: 0, y: 0, opacity: 0 };
    };
    var enter = function (data) {
        var validity = true;
        var x = LinkTransitions_1.getX(stratifiedMap[data].width, xOffset, backboneOffset);
        // let backboneBundleNodes = findBackboneBundleNodes(stratifiedMap, bundleMap)
        var highestDepth = stratifiedMap[data].depth;
        var lowestDepth = stratifiedMap[data].depth;
        if (bundleMap && expandedClusterList.includes(data)) {
            for (var i = 0; i < bundleMap[data].bunchedNodes.length; i++) {
                // if(stratifiedMap[bundleMap[data].bunchedNodes[i]].width != 0)
                // {
                //   validity = false;
                // }
                if (stratifiedMap[bundleMap[data].bunchedNodes[i]] && stratifiedMap[bundleMap[data].bunchedNodes[i]].depth < highestDepth) {
                    highestDepth = stratifiedMap[bundleMap[data].bunchedNodes[i]].depth;
                }
                if (stratifiedMap[bundleMap[data].bunchedNodes[i]] && stratifiedMap[bundleMap[data].bunchedNodes[i]].depth > lowestDepth) {
                    lowestDepth = stratifiedMap[bundleMap[data].bunchedNodes[i]].depth;
                }
            }
        }
        var y = yOffset * highestDepth;
        if (annotationOpen !== -1 && highestDepth > annotationOpen) {
            y += annotationHeight;
        }
        var height = 0;
        for (var j in bundleMap[data].bunchedNodes) {
            if (stratifiedMap[bundleMap[data].bunchedNodes[j]]) {
                height++;
            }
        }
        height = clusterOffset * height;
        if (!expandedClusterList.includes(data)) {
            height = 10;
        }
        if (annotationOpen !== -1 &&
            annotationOpen >= highestDepth &&
            annotationOpen <= lowestDepth) {
            height += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opacity: [!expandedClusterList.includes(data) ? 0 : 1],
            timing: { duration: duration },
            validity: validity,
            height: height
        };
    };
    var update = function (data) {
        var validity = true;
        var x = LinkTransitions_1.getX(stratifiedMap[data].width, xOffset, backboneOffset);
        // let backboneBundleNodes = findBackboneBundleNodes(stratifiedMap, bundleMap)
        var highestDepth = stratifiedMap[data].depth;
        var lowestDepth = stratifiedMap[data].depth;
        if (bundleMap && expandedClusterList.includes(data)) {
            for (var i = 0; i < bundleMap[data].bunchedNodes.length; i++) {
                // if(stratifiedMap[bundleMap[data].bunchedNodes[i]].width != 0)
                // {
                //   validity = false;
                // }
                if (stratifiedMap[bundleMap[data].bunchedNodes[i]] && stratifiedMap[bundleMap[data].bunchedNodes[i]].depth < highestDepth) {
                    highestDepth = stratifiedMap[bundleMap[data].bunchedNodes[i]].depth;
                }
                if (stratifiedMap[bundleMap[data].bunchedNodes[i]] && stratifiedMap[bundleMap[data].bunchedNodes[i]].depth > lowestDepth) {
                    lowestDepth = stratifiedMap[bundleMap[data].bunchedNodes[i]].depth;
                }
            }
        }
        var y = yOffset * highestDepth;
        if (annotationOpen !== -1 && highestDepth > annotationOpen) {
            y += annotationHeight;
        }
        var height = 0;
        for (var j in bundleMap[data].bunchedNodes) {
            if (stratifiedMap[bundleMap[data].bunchedNodes[j]]) {
                height++;
            }
        }
        height = clusterOffset * height;
        if (!expandedClusterList.includes(data)) {
            height = 10;
        }
        if (annotationOpen !== -1 &&
            annotationOpen >= highestDepth &&
            annotationOpen <= lowestDepth) {
            height += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opacity: [!expandedClusterList.includes(data) ? 0 : 1],
            timing: { duration: duration },
            validity: validity,
            height: [height]
        };
    };
    return { enter: enter, leave: start, update: update, start: start };
}
exports.default = bundleTransitions;
//# sourceMappingURL=BundleTransitions.js.map