"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findBundleParent(nodeId, bundleMap) {
    var parentList = [];
    for (var bundle in bundleMap) {
        if (bundleMap[bundle].bunchedNodes.includes(nodeId)) {
            parentList.push(bundle);
        }
    }
    return parentList;
}
exports.default = findBundleParent;
//# sourceMappingURL=findBundleParent.js.map