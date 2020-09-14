import { Notebook } from '@jupyterlab/notebook';
import { IObservableList } from '@jupyterlab/observables';
import { ICellModel } from '@jupyterlab/cells';
import { NotebookProvenance } from './notebook-provenance';
/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export declare class NotebookProvenanceTracker {
    private notebookProvenance;
    private _prevActiveCellValue;
    private _prevActiveCellIndex;
    private _prevModel;
    /**
     *
     */
    constructor(notebookProvenance: NotebookProvenance);
    trackActiveCell(): any;
    trackCellExecution(): any;
    /**
     * Handle a change in the cells list
     */
    trackCellsChanged(): any;
    trackCellValueChanged(notebook: Notebook, change?: IObservableList.IChangedArgs<ICellModel>): void;
}
