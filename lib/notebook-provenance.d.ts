import { JupyterLab } from '@jupyterlab/application';
import { INotebookModel, Notebook } from '@jupyterlab/notebook';
import { ISessionContext } from '@jupyterlab/apputils';
import { Provenance } from '@visdesignlab/trrack';
import { NotebookProvenanceTracker } from './provenance-tracker';
import { PartialJSONValue } from '@lumino/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
/**
 * interface representing the state of the application
 */
export interface ApplicationState {
    model: PartialJSONValue;
    modelWorkaround: number;
    activeCell: number;
    cellValue: string;
    cellType: string;
    moveToIndex: number;
    removeCellIndex?: number;
}
export interface ApplicationExtra {
    changedCellId: number;
    relations?: number[];
}
export declare type EventTypes = "Change active cell" | "executeCell" | "addCell" | "removeCell" | "moveCell" | "setCell" | "changeCellValue";
export declare const EventTypes: string[];
/**
 * Model for a provenance graph.
 */
export declare class NotebookProvenance {
    private app;
    readonly notebook: Notebook;
    private sessionContext;
    private context;
    private _actionFunctions;
    private _nbtracker;
    private _prov;
    pauseTracking: boolean;
    pauseObserverExecution: boolean;
    constructor(app: JupyterLab, notebook: Notebook, sessionContext: ISessionContext, context: DocumentRegistry.IContext<INotebookModel>);
    private init;
    protected saveProvenanceGraph(): void;
    get nbtracker(): NotebookProvenanceTracker;
    get prov(): Provenance<ApplicationState, EventTypes, ApplicationExtra>;
}
