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
const provenance_core_1 = require("@visualstorytelling/provenance-core");
const action_functions_1 = require("./action-functions");
const apputils_1 = require("@jupyterlab/apputils");
// import {ProvenanceGraph} from '@visdesignlab/provenance-lib-core';
// import{
//       initProvenance,
//       ProvenanceGraph,
//       Provenance,
//       ActionFunction,
//       SubscriberFunction,
//       NodeMetadata,
//       NodeID,
//       Diff,
//       RootNode,
//       StateNode,
//       ProvenanceNode,
//       isStateNode,
//       Nodes,
//       CurrentNode,
//       Artifacts,
//       Extra
// } from '@visdesignlab/provenance-lib-core';
/**
 * Model for a provenance graph.
 */
class NotebookProvenance {
    // private _nbtracker: NotebookProvenanceTracker;
    constructor(app, notebook, sessionContext) {
        this.app = app;
        this.notebook = notebook;
        this.sessionContext = sessionContext;
        this.init();
    }
    init() {
        // if (this.notebook.model!.metadata.has('provenance')) {
        //     const serGraph = this.notebook.model!.metadata.get('provenance');
        //     if (serGraph) {
        //         this._graph = restoreProvenanceGraph(serGraph as unknown as SerializedProvenanceGraph);
        //     } else {
        //         this._graph = new ProvenanceGraph({ name: 'nbprovenance.default.graph', version: this.app.version });
        //     }
        // } else {
        this._graph = new provenance_core_1.ProvenanceGraph({ name: 'nbprovenance.default.graph', version: this.app.version });
        // }
        this.sessionContext.ready.then(() => {
            this._graph.on('nodeAdded', (node) => this.onNodeAdded(node));
        });
        this._registry = new provenance_core_1.ActionFunctionRegistry();
        this._actionFunctions = new action_functions_1.ActionFunctions(this.notebook, this.sessionContext);
        // get method names from the object (see https://stackoverflow.com/a/48051971)
        let actionFunctionNames = Object.getPrototypeOf(this._actionFunctions);
        Object.getOwnPropertyNames(actionFunctionNames)
            .filter((d) => d !== 'constructor')
            .map((name) => {
            // dynamically register all functions from the ActionFunctions class/object
            this._registry.register(name, this._actionFunctions[name], this._actionFunctions);
        });
        this._tracker = new provenance_core_1.ProvenanceTracker(this._registry, this._graph);
        this._traverser = new provenance_core_1.ProvenanceGraphTraverser(this._registry, this._graph, this._tracker);
        this._traverser.trackingWhenTraversing = false;
        this._traverser.on('invalidTraversal', (node) => __awaiter(this, void 0, void 0, function* () {
            const restart = window.confirm('Can only traverse to node by restarting kernel, clearing notebook and re-executing provenance graph');
            if (restart) {
                // await this.sessionContext.restart();
                // await this.sessionContext.session!.kernel!.restart();
                yield apputils_1.sessionContextDialogs.restart(this.sessionContext); // TODO: check if this solution works as expected
                // pause tracker, as clearing notebook adds node to graph
                this._tracker.acceptActions = false;
                this.notebook.model.cells.clear();
                this.notebook.model.cells.insert(0, this.notebook.model.contentFactory.createCodeCell({}));
                this._tracker.acceptActions = true;
                // unpause tracker b
                this._graph.current = this._graph.root;
                this._traverser.toStateNode(node.id);
            }
        }));
        // this._nbtracker = new NotebookProvenanceTracker(this);
    }
    onNodeAdded(node) {
        // @ts-ignore
        this.notebook.model.metadata.set('provenance', provenance_core_1.serializeProvenanceGraph(this._graph));
        // console.log('node added to graph', node);
    }
    get traverser() {
        return this._traverser;
    }
    get tracker() {
        return this._tracker;
    }
    // public get nbtracker(): NotebookProvenanceTracker {
    //     return this._nbtracker;
    // }
    get pauseTracking() {
        return this._actionFunctions.pauseTracking;
    }
    get graph() {
        return this._graph;
    }
    get registry() {
        return this._registry;
    }
}
exports.NotebookProvenance = NotebookProvenance;
//# sourceMappingURL=notebook-provenance-visdesignlab.js.map