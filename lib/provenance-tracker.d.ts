import { Notebook } from '@jupyterlab/notebook';
import { IObservableList } from '@jupyterlab/observables';
import { ICellModel } from '@jupyterlab/cells';
import { NotebookProvenance } from './notebook-provenance';
import { PartialJSONValue } from '@lumino/coreutils';
/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export declare class NotebookProvenanceTracker {
    private notebookProvenance;
    _prevActiveCellValue: string;
    _prevActiveCellIndex: number;
    _prevModel: PartialJSONValue;
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
