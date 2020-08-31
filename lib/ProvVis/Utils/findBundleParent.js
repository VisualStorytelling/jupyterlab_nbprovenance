"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findBundleParent(nodeId, bundleMap) {
    let parentList = [];
    for (let bundle in bundleMap) {
        if (bundleMap[bundle].bunchedNodes.includes(nodeId)) {
            parentList.push(bundle);
        }
    }
    return parentList;
}
exports.default = findBundleParent;
//# sourceMappingURL=findBundleParent.js.map