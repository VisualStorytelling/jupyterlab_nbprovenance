"use strict";
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
function findBackboneBundleNodes(nodeMap, bundleMap) {
    var e_1, _a, e_2, _b;
    var backboneBundleNodes = [];
    // Find nodes in the clusters whose entire cluster is on the backbone.
    for (var bundle in bundleMap) {
        var flag = true;
        if (nodeMap[bundle].width !== 0) {
            flag = false;
        }
        try {
            for (var _c = (e_1 = void 0, __values(bundleMap[bundle].bunchedNodes)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var i = _d.value;
                if (nodeMap[i].width !== 0) {
                    flag = false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (flag) {
            backboneBundleNodes.push(bundle);
            try {
                for (var _e = (e_2 = void 0, __values(bundleMap[bundle].bunchedNodes)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var n = _f.value;
                    backboneBundleNodes.push(n);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    return backboneBundleNodes;
}
exports.default = findBackboneBundleNodes;
//# sourceMappingURL=findBackboneBundleNodes.js.map