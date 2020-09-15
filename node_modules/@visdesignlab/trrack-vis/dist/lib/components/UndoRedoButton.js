"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var typestyle_1 = require("typestyle");
function UndoRedoButton(_a) {
    var graph = _a.graph, undoCallback = _a.undoCallback, redoCallback = _a.redoCallback;
    if (graph === undefined) {
        return null;
    }
    var isAtRoot = graph.root === graph.current;
    var isAtLatest = graph.nodes[graph.current].children.length === 0;
    var margin = {
        marginRight: "3px"
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { className: undoButtonStyle, disabled: isAtRoot, onClick: undoCallback },
            react_1.default.createElement("i", { style: margin, className: "fas fa-undo marginRight" }),
            "Undo"),
        react_1.default.createElement("button", { className: redoButtonStyle, disabled: isAtLatest, onClick: redoCallback },
            react_1.default.createElement("i", { style: margin, className: "fas fa-redo marginRight" }),
            "Redo")));
}
var undoButtonStyle = typestyle_1.style({
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
var marginRight = typestyle_1.style({
    marginRight: "3px",
});
var redoButtonStyle = typestyle_1.style({
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