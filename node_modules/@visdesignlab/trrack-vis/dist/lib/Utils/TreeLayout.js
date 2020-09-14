"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
exports.getPathTo = exports.treeLayout = void 0;
function treeLayout(nodes, current, root) {
    var depthMap = {};
    var currentPath = getPathTo(nodes, root, current);
    DFS(nodes, root, depthMap, currentPath);
    return currentPath;
}
exports.treeLayout = treeLayout;
function DFS(nodes, node, depthMap, currentPath) {
    var explored = new Set();
    var toExplore = [];
    var currDepth = 0;
    toExplore.push(nodes[node]);
    while (toExplore.length > 0) {
        var temp = toExplore.pop();
        if (!explored.has(temp.id)) {
            temp.width = currDepth;
            depthMap[temp.id] = temp.width;
            explored.add(temp.id);
        }
        else {
            temp.width = depthMap[temp.id];
        }
        if (temp.children) {
            toExplore.push.apply(toExplore, __spread(temp.children.sort(function (a, b) {
                var aIncludes = currentPath.includes(a.id) ? 1 : 0;
                var bIncludes = currentPath.includes(b.id) ? 1 : 0;
                return aIncludes - bIncludes;
            })));
        }
        else {
            currDepth++;
        }
    }
}
function getPathTo(nodes, from, to) {
    var path = [];
    search(nodes, from, to, path);
    return __spread([from], path.reverse());
}
exports.getPathTo = getPathTo;
function search(nodes, node, final, path) {
    var e_1, _a;
    if (!nodes[node])
        return false;
    if (node === final) {
        path.push(node);
        return true;
    }
    var children = nodes[node].children || [];
    try {
        for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var child = children_1_1.value;
            if (search(nodes, child.id, final, path)) {
                path.push(child.id);
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
//# sourceMappingURL=TreeLayout.js.map