"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoRedoButtonCreator = exports.ProvVisCreator = void 0;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var ProvVis_1 = require("./ProvVis");
var UndoRedoButton_1 = require("./UndoRedoButton");
function ProvVisCreator(node, prov, callback, buttons, ephemeralUndo, fauxRoot, config) {
    if (buttons === void 0) { buttons = true; }
    if (ephemeralUndo === void 0) { ephemeralUndo = false; }
    if (fauxRoot === void 0) { fauxRoot = prov.graph().root; }
    if (config === void 0) { config = {}; }
    react_dom_1.default.render(react_1.default.createElement(ProvVis_1.default, __assign({}, config, { root: fauxRoot, changeCurrent: callback, current: prov.graph().current, nodeMap: prov.graph().nodes, prov: prov, undoRedoButtons: true, ephemeralUndo: ephemeralUndo })), node);
}
exports.ProvVisCreator = ProvVisCreator;
function UndoRedoButtonCreator(node, graph, undoCallback, redoCallback) {
    react_dom_1.default.render(react_1.default.createElement(UndoRedoButton_1.default, { graph: graph, undoCallback: undoCallback, redoCallback: redoCallback }), node);
}
exports.UndoRedoButtonCreator = UndoRedoButtonCreator;
//# sourceMappingURL=ProvVisCreator.js.map