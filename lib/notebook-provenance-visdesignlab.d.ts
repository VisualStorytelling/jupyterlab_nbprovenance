import { // class
ProvenanceNode, // class
IProvenanceGraphTraverser, // class
IActionFunctionRegistry, // interface
IProvenanceTracker } from '@visualstorytelling/provenance-core';
import { JupyterLab } from '@jupyterlab/application';
import { Notebook } from '@jupyterlab/notebook';
import { ISessionContext } from '@jupyterlab/apputils';
import { Provenance } from '@visdesignlab/provenance-lib-core';
import { NotebookProvenanceTracker } from './provenance-tracker';
/**
 * interface representing the state of the application
 */
export interface NodeState {
    activeCell: string;
}
export interface NodeExtra {
    nodeNum: number;
    nodeX: number;
    nodeY: number;
}
declare type EventTypes = "changeActiveCell" | "Select Node" | "Hover Node";
/**
 * Model for a provenance graph.
 */
export declare class NotebookProvenance {
    private app;
    readonly notebook: Notebook;
    private sessionContext;
    private _traverser;
    private _registry;
    private _actionFunctions;
    private _tracker;
    private _nbtracker;
    private _prov;
    constructor(app: JupyterLab, notebook: Notebook, sessionContext: ISessionContext);
    private init;
    protected onNodeAdded(node: ProvenanceNode): void;
    get traverser(): IProvenanceGraphTraverser;
    get tracker(): IProvenanceTracker;
    get nbtracker(): NotebookProvenanceTracker;
    get prov(): Provenance<NodeState, EventTypes, NodeExtra>;
    get pauseTracking(): boolean;
    get registry(): IActionFunctionRegistry;
}
export {};
