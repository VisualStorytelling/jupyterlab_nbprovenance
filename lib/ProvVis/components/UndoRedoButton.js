"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const typestyle_1 = require("typestyle");
function UndoRedoButton({ graph, undoCallback, redoCallback }) {
    if (graph === undefined) {
        return null;
    }
    const isAtRoot = graph.root === graph.current;
    const isAtLatest = graph.nodes[graph.current].children.length === 0;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { className: undoButtonStyle, disabled: isAtRoot, onClick: undoCallback }, "Undo"),
        react_1.default.createElement("button", { className: redoButtonStyle, disabled: isAtLatest, onClick: redoCallback }, "Redo")));
}
const undoButtonStyle = typestyle_1.style({
    backgroundColor: "#768d87",
    borderRadius: "2px",
    border: "none",
    display: "inline-block",
    cursor: "pointer",
    color: "#ffffff",
    fontFamily: "Lato,Helvetica Neue,Arial,Helvetica,sans-serif",
    fontSize: "14px",
    padding: "5px 15px",
    marginRight: "1px",
    marginLeft: "10px",
    $nest: {
        "&:hover": {
            backgroundColor: "#6c7c7c"
        },
        "&:disabled": {
            backgroundColor: "#a8b3b0"
        },
        "&:active": {
            backgroundColor: "#6c7c7c"
        }
    }
});
const redoButtonStyle = typestyle_1.style({
    backgroundColor: "#768d87",
    borderRadius: "2px",
    border: "none",
    display: "inline-block",
    cursor: "pointer",
    color: "#ffffff",
    fontFamily: "Lato,Helvetica Neue,Arial,Helvetica,sans-serif",
    fontSize: "14px",
    padding: "5px 15px",
    $nest: {
        "&:hover": {
            backgroundColor: "#6c7c7c"
        },
        "&:disabled": {
            backgroundColor: "#a8b3b0"
        },
        "&:active": {
            backgroundColor: "#6c7c7c"
        }
    }
});
exports.default = UndoRedoButton;
//# sourceMappingURL=UndoRedoButton.js.map