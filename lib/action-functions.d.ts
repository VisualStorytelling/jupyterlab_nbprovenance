import { Notebook } from '@jupyterlab/notebook';
/**
 * Define available action functions that are calling the NotebookActions
 *
 * All functions of these class are automatically registered in the
 * `ActionFunctionRegistry` object in `NotebookProvenance`.
 *
 * Be aware that renaming function names will break existing provenance graphs!
 */
export declare class ActionFunctions {
    private notebook;
    pauseTracking: boolean;
    constructor(notebook: Notebook);
    moveCell(fromIndex: number, toIndex: number): Promise<null>;
    setCell(index: number, cellType: string): Promise<null>;
    changeActiveCell(index: number): Promise<null>;
    cellValue(index: number, value: string): Promise<void>;
}
