"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_functions_1 = require("./action-functions");
const trrack_1 = require("@visdesignlab/trrack");
const provenance_tracker_1 = require("./provenance-tracker");
const side_bar_1 = require("./side-bar");
;
;
/**
 * Initial state
 */
const initialState = {
    model: {},
    activeCell: 0,
    modelWorkaround: 0,
    cellValue: "",
    cellType: "code",
    moveToIndex: 0,
    removeCellIndex: 0
};
exports.EventTypes = ["Active cell", "executeCell", "addCell", "removeCell", "moveCell", "setCell", "changeCellValue"];
/**
 * Model for a provenance graph.
 */
class NotebookProvenance {
    // Why is this context not working like app, notebook, sessionContext?
    constructor(notebook, context, provenanceView) {
        this.notebook = notebook;
        this.context = context;
        this.provenanceView = provenanceView;
        // instad of actionFunctions.pauseTracking just use a field here
        this.pauseTracking = false;
        this.pauseObserverExecution = false;
        this.init();
    }
    init() {
        this._prov = trrack_1.initProvenance(initialState, false);
        // this._prov = initProvenance<ApplicationState, EventTypes, ApplicationExtra>(initialState, true, true, {
        //   apiKey: "AIzaSyCVqzgH7DhN9roG9gaFqGMqh-zj3vd8tww",
        //   authDomain: "nbprovenance.firebaseapp.com",
        //   databaseURL: "https://nbprovenance.firebaseio.com",
        //   projectId: "nbprovenance",
        //   storageBucket: "nbprovenance.appspot.com",
        //   messagingSenderId: "814327140471",
        //   appId: "1:814327140471:web:31b23df7c94ff3dd00b672",
        //   measurementId: "G-Z6JK4BJ7KB"
        // });
        this.context.saveState.connect(this.saveProvenanceGraph, this);
        if (this.notebook.model.metadata.has('provenance')) {
            const serGraph = this.notebook.model.metadata.get('provenance');
            if (serGraph) {
                this._prov.importProvenanceGraph(serGraph.toString());
            }
        }
        this._actionFunctions = new action_functions_1.ActionFunctions(this.notebook);
        this.prov.addObserver(["modelWorkaround"], () => {
            this.pauseTracking = true;
            if (!this.pauseObserverExecution) {
                let state = this.prov.current().getState();
                this.notebook.model.fromJSON(state.model);
                this._actionFunctions.cellValue(state.activeCell, state.cellValue);
                this._actionFunctions.changeActiveCell(state.activeCell);
                if (state.activeCell != state.moveToIndex) {
                    this._actionFunctions.moveCell(state.activeCell, state.moveToIndex);
                }
                else {
                    this._actionFunctions.setCell(state.activeCell, state.cellType);
                }
                // When the user clicks on a past state and then changes the cell value, the old values have to be known:
                this._nbtracker._prevActiveCellIndex = state.activeCell;
                this._nbtracker._prevActiveCellValue = state.cellValue;
                this._nbtracker._prevModel = state.model;
                // this._nbtracker._prevValuesLoadedByProvenance = true;
            }
            this.pauseTracking = false;
            // Only update when it is visible --> performance
            if (this.provenanceView.isVisible) {
                side_bar_1.provVisUpdate(this._prov);
            }
        });
        this.prov.addObserver(["activeCell"], () => {
            // console.log("activeCell observer called");
            this.pauseTracking = true;
            if (!this.pauseObserverExecution) {
                let state = this.prov.current().getState();
                this._actionFunctions.changeActiveCell(state.activeCell);
                // When the user clicks on a past state and then changes the cell value, the old values have to be known:
                this._nbtracker._prevActiveCellIndex = state.activeCell;
                this._nbtracker._prevActiveCellValue = state.cellValue;
                this._nbtracker._prevModel = state.model;
                // this._nbtracker._prevValuesLoadedByProvenance = true;
            }
            this.pauseTracking = false;
            if (this.provenanceView.isVisible) {
                side_bar_1.provVisUpdate(this._prov);
            }
        });
        // Call this when all the observers are defined.
        // This is optional and only used when you want to enable sharing and loading states from URL.
        // Refer documentation for advanced usage scenario.
        this.prov.done();
        this._nbtracker = new provenance_tracker_1.NotebookProvenanceTracker(this);
    }
    saveProvenanceGraph() {
        console.log("Saving provenance graph in notebookfile");
        this.notebook.model.metadata.set('provenance', this._prov.exportProvenanceGraph());
    }
    get nbtracker() {
        return this._nbtracker;
    }
    get prov() {
        return this._prov;
    }
}
exports.NotebookProvenance = NotebookProvenance;
//# sourceMappingURL=notebook-provenance.js.map