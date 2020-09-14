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
exports.EventTypes = ["Change active cell", "executeCell", "addCell", "removeCell", "moveCell", "setCell", "changeCellValue"];
/**
 * Model for a provenance graph.
 */
class NotebookProvenance {
    // private _prov: string;
    // Why is this context not working like app, notebook, sessionContext?
    constructor(app, notebook, sessionContext, context) {
        this.app = app;
        this.notebook = notebook;
        this.sessionContext = sessionContext;
        this.context = context;
        // instad of actionFunctions.pauseTracking just use a field here
        this.pauseTracking = false;
        this.pauseObserverExecution = false;
        this.init(context);
    }
    init(context) {
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
        context.saveState.connect(this.saveProvenanceGraph, this);
        if (this.notebook.model.metadata.has('provenance')) {
            const serGraph = this.notebook.model.metadata.get('provenance');
            if (serGraph) {
                this._prov.importProvenanceGraph(serGraph.toString());
            }
            else {
                //this._graph = new ProvenanceGraph({ name: 'nbprovenance.default.graph', version: this.app.version });
            }
        }
        else {
            //this._graph = new ProvenanceGraph({ name: 'nbprovenance.default.graph', version: this.app.version });
        }
        // to check if it loaded: this.prov.graph()
        // console.log("Graph at beginning:", this.prov.graph())
        this._actionFunctions = new action_functions_1.ActionFunctions(this.notebook, this.sessionContext);
        this.prov.addObserver(["modelWorkaround"], () => {
            // provVisUpdate()
            // console.log(this.prov.graph())
            // console.log("model observer called");
            debugger;
            this.pauseTracking = true;
            if (!this.pauseObserverExecution) {
                debugger;
                let state = this.prov.current().getState();
                // @ts-ignore
                this.notebook.model.fromJSON(state.model); //This takes a LOT of time I think?
                // @ts-ignore
                this.notebook.model.cells.get(state.activeCell).value.text = state.cellValue;
                this._actionFunctions.changeActiveCell(state.activeCell);
                if (state.activeCell != state.moveToIndex) {
                    this._actionFunctions.moveCell(state.activeCell, state.moveToIndex);
                }
                else {
                    this._actionFunctions.setCell(state.activeCell, state.cellType);
                }
                if (state.removeCellIndex) {
                    // this._actionFunctions.removeCell(state.removeCellIndex);
                }
            }
            this.pauseTracking = false;
            side_bar_1.provVisUpdate(this._prov);
        });
        this.prov.addObserver(["activeCell"], () => {
            // console.log("activeCell observer called");
            this.pauseTracking = true;
            if (!this.pauseObserverExecution) {
                let state = this.prov.current().getState();
                // @ts-ignore
                //this.notebook.model.fromJSON(state.model); // This is needed because otherwise sometimes clicking on "addCell" won't change the state of the notebook
                // @ts-ignore
                // this.notebook.model.cells.get(state.activeCell).value.text = state.cellValue;
                this._actionFunctions.changeActiveCell(state.activeCell);
            }
            this.pauseTracking = false;
            side_bar_1.provVisUpdate(this._prov);
        });
        // this.prov.addObserver(["cellType"], () => {
        //   console.log("cellType observer called");
        //   this.pauseTracking = true;
        //   if(!this.pauseObserverExecution){
        //
        //     let state = this.prov.current().getState();
        //     // @ts-ignore
        //     this.notebook.model.cells.get(state.activeCell).type = state.cellType;
        //     this._actionFunctions.setCell(state.activeCell, state.cellType);
        //   }
        //
        //   provVisUpdate(this._prov);
        //   this.pauseTracking = false;
        // });
        //
        // this.prov.addObserver(["cellValue"], () => {
        //   console.log("cellValue observer called");
        //   this.pauseTracking = true;
        //   if(!this.pauseObserverExecution){
        //
        //     let state = this.prov.current().getState();
        //     // @ts-ignore
        //     this.notebook.model.fromJSON(state.model);
        //     // @ts-ignore
        //     this.notebook.model.cells.get(state.activeCell).value.text = state.cellValue;
        //   }
        //   this.pauseTracking = false;
        //   provVisUpdate(this._prov);
        // });
        // Call this when all the observers are defined.
        // This is optional and only used when you want to enable sharing and loading states from URL.
        // Refere documentation for advanced usage scenario.
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