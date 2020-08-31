import { ICell, IOutput } from '@jupyterlab/nbformat';
import { Notebook } from '@jupyterlab/notebook';
import { ISessionContext } from '@jupyterlab/apputils';
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
    private session;
    pauseTracking: boolean;
    constructor(notebook: Notebook, session: ISessionContext);
    addCell(index: number, cell: ICell): Promise<null>;
    removeCell(index: number): Promise<null>;
    moveCell(fromIndex: number, toIndex: number): Promise<null>;
    setCell(index: number, cell: ICell): Promise<null>;
    changeActiveCell(index: number): Promise<null>;
    cellValue(index: number, value: string): Promise<void>;
    executeCell(index: number): Promise<void>;
    cellOutputs(index: number, outputs: IOutput[]): Promise<void>;
    clearOutputs(index: number): Promise<void>;
    enableOutputScrolling(cellIndex: number): Promise<null>;
    disableOutputScrolling(cellIndex: number): Promise<null>;
    selectAll(): Promise<null>;
    deselectAll(): Promise<null>;
    selectAbove(cellIndex: number): Promise<null>;
    selectBelow(cellIndex: number): Promise<null>;
}
