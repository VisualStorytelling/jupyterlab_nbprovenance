"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const ProvVis_1 = __importDefault(require("./ProvVis"));
const UndoRedoButton_1 = __importDefault(require("./UndoRedoButton"));
function ProvVisCreator(node, prov, callback, buttons = true, ephemeralUndo = false, fauxRoot = prov.graph().root, config = {}) {
    react_dom_1.default.render(react_1.default.createElement(ProvVis_1.default, Object.assign({}, config, { root: fauxRoot, changeCurrent: callback, current: prov.graph().current, nodeMap: prov.graph().nodes, prov: prov, undoRedoButtons: true, ephemeralUndo: ephemeralUndo })), node);
}
exports.ProvVisCreator = ProvVisCreator;
function UndoRedoButtonCreator(node, graph, undoCallback, redoCallback) {
    react_dom_1.default.render(react_1.default.createElement(UndoRedoButton_1.default, { graph: graph, undoCallback: undoCallback, redoCallback: redoCallback }), node);
}
exports.UndoRedoButtonCreator = UndoRedoButtonCreator;
//# sourceMappingURL=ProvVisCreator.js.map