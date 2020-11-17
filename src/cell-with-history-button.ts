// import { Widget } from "@lumino/widgets";
import { Cell, ICellModel } from '@jupyterlab/cells';

// Cell.IOptions<T> options;

/**
 * The main view for the notebook provenance.
 */
export class HistoryCell<T extends ICellModel = ICellModel> extends Cell {
    constructor(options: Cell.IOptions) {
        super(options);
    }
}