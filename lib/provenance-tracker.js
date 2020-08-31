"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notebook_1 = require("@jupyterlab/notebook");
const algorithm_1 = require("@lumino/algorithm");
/**
 * A notebook widget extension that adds a button to the toolbar.
 */
class NotebookProvenanceTracker {
    /**
     *
     */
    constructor(notebookProvenance) {
        this.notebookProvenance = notebookProvenance;
        // the initial values are needed because in new notebooks the very first change would not be tracked otherwise
        this._prevActiveCellValue = "";
        this._prevActiveCellIndex = 0;
        this._prevModel = Object();
        this.trackActiveCell();
        this.trackCellsChanged();
        this.trackCellExecution();
    }
    trackActiveCell() {
        // console.log("trackActiveCell");
        const activeCellChangedListener = (notebook) => {
            if (this.notebookProvenance.pauseTracking) {
                return;
            }
            // console.log("activeCellChanged");
            ;
            this.trackCellValueChanged(notebook);
            let action = this.notebookProvenance.prov.addAction("Active cell: " + String(notebook.activeCellIndex), (state) => {
                state.cellValue = notebook.model.cells.get(notebook.activeCellIndex).value.text; // save the NEW cells value
                state.moveToIndex = notebook.activeCellIndex;
                state.activeCell = notebook.activeCellIndex;
                return state;
            });
            console.log(action);
            this.notebookProvenance.pauseObserverExecution = true;
            action
                .addExtra({ changedCellId: this.notebookProvenance.notebook.activeCellIndex })
                .addEventType("Change active cell")
                .alwaysStoreState(true)
                .isEphemeral(true)
                .applyAction();
            this.notebookProvenance.pauseObserverExecution = false;
            // the prevActiveCellIndex is used to find the cell that has last been active
            // the prevActiveCellValue is used to store the value of the newly clicked cell --> stores the value before potentially changing the cell value
            // so the value of the cell of PREVIOUS index is compared with the prevActiveCellVALUE when clicking a new cell
            this._prevActiveCellIndex = notebook.activeCellIndex;
            ;
            if (notebook.model) {
                // @ts-ignore   _cellMap DOES exist
                let cell = notebook.model.cells._cellMap.values()[this._prevActiveCellIndex];
                if (cell.model) {
                    this._prevActiveCellValue = cell.model.value.text;
                }
                else if (cell.value) {
                    this._prevActiveCellValue = cell.value.text;
                }
            }
        };
        this.notebookProvenance.notebook.activeCellChanged.connect(activeCellChangedListener);
    }
    trackCellExecution() {
        const self = this;
        notebook_1.NotebookActions.executed.connect((_dummy, obj) => {
            if (this.notebookProvenance.pauseTracking) {
                return;
            }
            let notebook = self.notebookProvenance.notebook;
            if (notebook == null || notebook.model == null) {
                return;
            }
            ;
            // Track if cell value has been changed before adding e.g. adding a new cell
            this.trackCellValueChanged(notebook);
            // console.log('Cell ran', obj.cell);
            let index = -1;
            // either notebook is missing model sometimes, test both
            if (notebook.model && notebook.model.cells) {
                index = algorithm_1.toArray(notebook.model.cells.iter()).indexOf(obj.cell.model);
            }
            else if (obj.notebook.model && obj.notebook.model.cells) {
                index = algorithm_1.toArray(obj.notebook.model.cells.iter()).indexOf(obj.cell.model);
            }
            else {
                throw new Error('Unable to find cell in notebook');
            }
            let action = this.notebookProvenance.prov.addAction("executeCell", (state) => {
                state.model = notebook.model.toJSON();
                this._prevModel = state.model;
                ;
                state.cellValue = notebook.model.cells.get(notebook.activeCellIndex).value.text; // save the NEW cells value
                state.moveToIndex = notebook.activeCellIndex;
                state.activeCell = notebook.activeCellIndex;
                state.modelWorkaround++;
                return state;
            });
            console.log(action);
            this.notebookProvenance.pauseObserverExecution = true;
            action
                .addExtra({ changedCellId: index })
                .addEventType("executeCell")
                .alwaysStoreState(true)
                .applyAction();
            this.notebookProvenance.pauseObserverExecution = false;
            this._prevActiveCellIndex = this.notebookProvenance.notebook.activeCellIndex;
            if (notebook.model) {
                // @ts-ignore   _cellMap DOES exist
                let cell = notebook.model.cells._cellMap.values()[this._prevActiveCellIndex];
                if (cell.model) {
                    this._prevActiveCellValue = cell.model.value.text;
                }
            }
        }, this);
    }
    /**
     * Handle a change in the cells list
     */
    trackCellsChanged() {
        // the initial values are needed because in new notebooks the very first change would not be tracked otherwise
        // let prevActiveCellValue: string = "";
        // let prevActiveCellIndex: number = 0;
        const cellsChangedListener = (list, change) => {
            if (this.notebookProvenance.pauseTracking) {
                return;
            }
            const self = this;
            const notebook = self.notebookProvenance.notebook;
            let currentCell;
            if (notebook.model) {
                currentCell = notebook.model.cells.get(notebook.activeCellIndex);
            }
            // console.log("_onCellsChanged");
            // console.log(change);
            ;
            // Track if cell value has been changed before adding e.g. adding a new cell
            this.trackCellValueChanged(notebook, change);
            let action;
            let cellPositions;
            let length; // length of the cells array
            switch (change.type) {
                case 'add':
                    action = this.notebookProvenance.prov.addAction("Add cell", (state) => {
                        state.cellValue = currentCell.value.text;
                        state.cellType = currentCell.type;
                        state.moveToIndex = notebook.activeCellIndex;
                        state.activeCell = notebook.activeCellIndex;
                        if (notebook.model) {
                            state.model = notebook.model.toJSON();
                            this._prevModel = state.model;
                            state.modelWorkaround++;
                        }
                        return state;
                    });
                    // moved from change.oldIndex to change.newIndex
                    // all in between are changed. If index is decreased(new index < old index), others are increased. If index is increased, others are decreased
                    if (notebook.model) {
                        length = notebook.model.cells.length - 1;
                        cellPositions = new Array(length);
                        for (let i = 0; i < length; i++) {
                            cellPositions[i] = i;
                        }
                        for (let i = change.newIndex; i < length; i++) {
                            cellPositions[i] = i + 1;
                        }
                    }
                    console.log(action);
                    this.notebookProvenance.pauseObserverExecution = true;
                    action
                        .addExtra({
                        changedCellId: change.newIndex,
                        cellPositions: cellPositions
                    })
                        .addEventType("addCell")
                        .alwaysStoreState(true)
                        .applyAction();
                    this.notebookProvenance.pauseObserverExecution = false;
                    break;
                case 'remove':
                    action = this.notebookProvenance.prov.addAction("removeCell", (state) => {
                        state.cellValue = currentCell.value.text;
                        state.cellType = currentCell.type;
                        state.moveToIndex = notebook.activeCellIndex;
                        state.activeCell = notebook.activeCellIndex;
                        state.removeCellIndex = notebook.activeCellIndex;
                        if (notebook.model) {
                            state.model = notebook.model.toJSON();
                            this._prevModel = state.model;
                            state.modelWorkaround++;
                        }
                        return state;
                    });
                    ;
                    if (notebook.model) {
                        length = notebook.model.cells.length + 1; // because the remove has already decreased the size, but the size before that is needed
                        cellPositions = new Array(length);
                        for (let i = 0; i < change.oldIndex; i++) {
                            cellPositions[i] = i;
                        }
                        cellPositions[change.oldIndex] = -1;
                        for (let i = change.oldIndex + 1; i < length; i++) {
                            cellPositions[i] = i - 1;
                        }
                    }
                    console.log(action);
                    this.notebookProvenance.pauseObserverExecution = true;
                    action
                        .addExtra({
                        changedCellId: change.newIndex,
                        cellPositions: cellPositions
                    })
                        .addEventType("removeCell")
                        .alwaysStoreState(true)
                        .applyAction();
                    this.notebookProvenance.pauseObserverExecution = false;
                    break;
                case 'move':
                    action = this.notebookProvenance.prov.addAction("moveCell", (state) => {
                        state.cellValue = currentCell.value.text;
                        state.cellType = currentCell.type;
                        state.moveToIndex = notebook.activeCellIndex;
                        state.activeCell = notebook.activeCellIndex;
                        if (notebook.model) {
                            state.model = notebook.model.toJSON();
                            this._prevModel = state.model;
                            state.modelWorkaround++;
                        }
                        return state;
                    });
                    // moved from change.oldIndex to change.newIndex
                    // all in between are changed. If index is decreased(new index < old index), others are increased. If index is increased, others are decreased
                    if (notebook.model) {
                        cellPositions = new Array(notebook.model.cells.length);
                        for (let i = 0; i < notebook.model.cells.length; i++) {
                            cellPositions[i] = i;
                        }
                        cellPositions[change.oldIndex] = change.newIndex;
                        if (change.newIndex < change.oldIndex) {
                            for (let i = change.newIndex; i < change.oldIndex; i++) {
                                cellPositions[i] = i + 1;
                            }
                        }
                        else {
                            for (let i = change.oldIndex + 1; i <= change.newIndex; i++) {
                                cellPositions[i] = i - 1;
                            }
                        }
                    }
                    console.log(action);
                    this.notebookProvenance.pauseObserverExecution = true;
                    action
                        .addExtra({
                        changedCellId: change.newIndex,
                        cellPositions: cellPositions
                    })
                        .addEventType("moveCell")
                        .alwaysStoreState(true)
                        .applyAction();
                    this.notebookProvenance.pauseObserverExecution = false;
                    break;
                case 'set': // caused by, e.g., change cell type
                    action = this.notebookProvenance.prov.addAction("setCell", (state) => {
                        state.cellValue = currentCell.value.text;
                        state.cellType = currentCell.type;
                        state.moveToIndex = notebook.activeCellIndex;
                        state.activeCell = notebook.activeCellIndex;
                        if (notebook.model) {
                            state.model = notebook.model.toJSON();
                            this._prevModel = state.model;
                            state.modelWorkaround++;
                        }
                        return state;
                    });
                    console.log(action);
                    this.notebookProvenance.pauseObserverExecution = true;
                    action
                        .addExtra({ changedCellId: change.newIndex })
                        .addEventType("setCell")
                        .alwaysStoreState(true)
                        .applyAction();
                    this.notebookProvenance.pauseObserverExecution = false;
                    break;
                default:
                    return;
            }
            ;
            this._prevActiveCellIndex = this.notebookProvenance.notebook.activeCellIndex;
            let cell;
            if (notebook.model) {
                // @ts-ignore _cellMap DOES exist
                cell = notebook.model.cells._cellMap.values()[this._prevActiveCellIndex];
                if (cell.model) {
                    this._prevActiveCellValue = cell.model.value.text;
                }
            }
        };
        this.notebookProvenance.notebook.model.cells.changed.connect(cellsChangedListener, this);
    }
    trackCellValueChanged(notebook, change) {
        // sometimes in between actions the model is null. e.g. wehen execute+addbelow is clicked, during the execute the model is null
        if (notebook.model == null) {
            return;
        }
        // Check if cell has changed
        // let cell: ICellModel = notebook.model!.cells.get(this._prevActiveCellIndex); // this is the cell that was active BEFORE changing active cell;
        // when removing, jupyterlab first calls changeActiveCell where the cellOrder of model.cells does NOT contain the current cell anymore,
        // the cell map on the other hand DOES still contain the cell ==> this solution needed instead of notebook.model!.cells.get(this._prevActiveCellIndex);
        let cell;
        if (notebook.model) {
            // @ts-ignore _cellMap DOES exist
            cell = notebook.model.cells._cellMap.values()[this._prevActiveCellIndex];
        }
        else {
            return;
        }
        if (change != null) {
            if (change.type == "move") {
                cell = change.newValues[0]; // this is the cell that was active BEFORE changing active cell, but at a different location now
            }
            if (change.type == "remove") {
                return; // do not track cell changes when removing: they are tracked by changeActiveCell already every time
            }
        }
        if (cell && this._prevActiveCellValue != cell.value.text) {
            // if so add to prov
            let action = this.notebookProvenance.prov.addAction("Cell value: " + cell.value.text, (state) => {
                state.cellValue = cell.value.text;
                this._prevActiveCellValue = state.cellValue; // otherwise e.g. execute+addCell will add a changeCellValue-action two times
                state.model = this._prevModel;
                // e.g. when switching activeCell after changing content and then writing content in the new cell this line is needed to preserve the model that would have existed
                // test: add cell, change content, click cell above, change content, execute without creating new cell, then click undo ==> problem
                if (notebook.model) {
                    this._prevModel = notebook.model.toJSON();
                    state.modelWorkaround++;
                }
                return state;
            });
            this.notebookProvenance.pauseObserverExecution = true;
            action
                .addExtra({ changedCellId: this._prevActiveCellIndex })
                .addEventType("changeCellValue")
                .alwaysStoreState(true)
                .applyAction();
            this.notebookProvenance.pauseObserverExecution = false;
        }
    }
}
exports.NotebookProvenanceTracker = NotebookProvenanceTracker;
//# sourceMappingURL=provenance-tracker.js.map