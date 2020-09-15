"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const notebook_1 = require("@jupyterlab/notebook");
/**
 * Define available action functions that are calling the NotebookActions
 *
 * All functions of these class are automatically registered in the
 * `ActionFunctionRegistry` object in `NotebookProvenance`.
 *
 * Be aware that renaming function names will break existing provenance graphs!
 */
class ActionFunctions {
    constructor(notebook) {
        this.notebook = notebook;
        this.pauseTracking = false;
    }
    moveCell(fromIndex, toIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('moved cell to index', fromIndex, toIndex);
            this.pauseTracking = true;
            this.notebook.model.cells.move(fromIndex, toIndex);
            this.pauseTracking = false;
            return null;
        });
    }
    setCell(index, cellType) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('set cell at index', index, cellType);
            this.pauseTracking = true;
            notebook_1.NotebookActions.changeCellType(this.notebook, cellType);
            this.pauseTracking = false;
            return null;
        });
    }
    changeActiveCell(index) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('change active cell to index', index);
            this.pauseTracking = true;
            this.notebook.activeCellIndex = index;
            this.pauseTracking = false;
            return null;
        });
    }
    cellValue(index, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const cell = this.notebook.model.cells.get(index);
            if (cell) {
                cell.value.text = value;
            }
        });
    }
}
exports.ActionFunctions = ActionFunctions;
//# sourceMappingURL=action-functions.js.map