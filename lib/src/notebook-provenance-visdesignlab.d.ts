import { ProvenanceGraph, // class
ProvenanceNode, // class
IProvenanceGraphTraverser, // class
IActionFunctionRegistry, // interface
IProvenanceTracker } from '@visualstorytelling/provenance-core';
import { JupyterLab } from '@jupyterlab/application';
import { Notebook } from '@jupyterlab/notebook';
import { ISessionContext } from '@jupyterlab/apputils';
/**
 * Model for a provenance graph.
 */
export declare class NotebookProvenance {
    private app;
    readonly notebook: Notebook;
    private sessionContext;
    private _traverser;
    private _registry;
    private _graph;
    private _actionFunctions;
    private _tracker;
    constructor(app: JupyterLab, notebook: Notebook, sessionContext: ISessionContext);
    private init;
    protected onNodeAdded(node: ProvenanceNode): void;
    get traverser(): IProvenanceGraphTraverser;
    get tracker(): IProvenanceTracker;
    get pauseTracking(): boolean;
    get graph(): ProvenanceGraph;
    get registry(): IActionFunctionRegistry;
}
