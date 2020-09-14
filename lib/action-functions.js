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
const cells_1 = require("@jupyterlab/cells");
const notebook_1 = require("@jupyterlab/notebook");
// This will be obsolete, since it is not event-based anymore
/**
 * Define available action functions that are calling the NotebookActions
 *
 * All functions of these class are automatically registered in the
 * `ActionFunctionRegistry` object in `NotebookProvenance`.
 *
 * Be aware that renaming function names will break existing provenance graphs!
 */
class ActionFunctions {
    constructor(notebook, session) {
        this.notebook = notebook;
        this.session = session;
        this.pauseTracking = false;
    }
    addCell(index, cell) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('added cell at index', index, cell);
            // code from NotebookModel.fromJSON() --> @jupyterlab/notebook/src/model.ts
            const factory = this.notebook.model.contentFactory; // !. for suppressing the "Object is possibly 'null'" error
            let cellModel;
            switch (cell.cell_type) {
                case 'code':
                    cellModel = factory.createCodeCell({ cell });
                    break;
                case 'markdown':
                    cellModel = factory.createMarkdownCell({ cell });
                    break;
                case 'raw':
                    cellModel = factory.createRawCell({ cell });
                    break;
                default:
                    console.error('Unknown cell type', cell.cell_type);
                    return null;
            }
            this.pauseTracking = true;
            this.notebook.model.cells.insert(index, cellModel);
            this.pauseTracking = false;
            return null;
        });
    }
    removeCell(index) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('removed cell at index', index);
            this.pauseTracking = true;
            this.notebook.model.cells.remove(index);
            this.pauseTracking = false;
            return null;
        });
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
    executeCell(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const cell = this.notebook.layout.widgets[index];
            if (cell) {
                cells_1.CodeCell.execute(cell, this.session);
            }
        });
    }
    cellOutputs(index, outputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const cell = this.notebook.widgets[index];
            const cellModel = this.notebook.model.cells.get(index);
            if (cellModel) {
                switch (cellModel.type) {
                    case 'markdown':
                        cell.rendered = true;
                        break;
                    case 'code':
                        cellModel.outputs.fromJSON(outputs);
                        break;
                    default:
                        break;
                }
            }
        });
    }
    clearOutputs(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const cell = this.notebook.widgets[index];
            const cellModel = this.notebook.model.cells.get(index);
            if (cellModel) {
                switch (cellModel.type) {
                    case 'markdown':
                        cell.rendered = false;
                        break;
                    case 'code':
                        cellModel.outputs.clear();
                        break;
                    default:
                        break;
                }
            }
        });
    }
    enableOutputScrolling(cellIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseTracking = true;
            this.notebook.activeCellIndex = cellIndex;
            notebook_1.NotebookActions.enableOutputScrolling(this.notebook);
            this.pauseTracking = false;
            return null;
        });
    }
    disableOutputScrolling(cellIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseTracking = true;
            this.notebook.activeCellIndex = cellIndex;
            notebook_1.NotebookActions.disableOutputScrolling(this.notebook);
            this.pauseTracking = false;
            return null;
        });
    }
    selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseTracking = true;
            notebook_1.NotebookActions.selectAll(this.notebook);
            this.pauseTracking = false;
            return null;
        });
    }
    deselectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseTracking = true;
            notebook_1.NotebookActions.deselectAll(this.notebook);
            this.pauseTracking = false;
            return null;
        });
    }
    selectAbove(cellIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseTracking = true;
            this.notebook.activeCellIndex = cellIndex;
            notebook_1.NotebookActions.selectAbove(this.notebook);
            this.pauseTracking = false;
            return null;
        });
    }
    selectBelow(cellIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseTracking = true;
            this.notebook.activeCellIndex = cellIndex;
            notebook_1.NotebookActions.selectBelow(this.notebook);
            this.pauseTracking = false;
            return null;
        });
    }
}
exports.ActionFunctions = ActionFunctions;
//# sourceMappingURL=action-functions.js.map