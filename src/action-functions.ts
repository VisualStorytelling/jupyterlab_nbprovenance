import * as nbformat from '@jupyterlab/nbformat';
import { ICellModel, CodeCellModel, MarkdownCell } from '@jupyterlab/cells';
import { NotebookActions, Notebook } from '@jupyterlab/notebook';

/**
 * Define available action functions that are calling the NotebookActions
 *
 * All functions of these class are automatically registered in the
 * `ActionFunctionRegistry` object in `NotebookProvenance`.
 *
 * Be aware that renaming function names will break existing provenance graphs!
 */
export class ActionFunctions {
    public pauseTracking: boolean = false;

    constructor(private notebook: Notebook) { }

    public async addCell(index: number, cell: nbformat.ICell) {
        console.log('added cell at index', index, cell);

        // code from NotebookModel.fromJSON() --> @jupyterlab/notebook/src/model.ts
        if (this.notebook && this.notebook.model) {
            const factory = this.notebook.model.contentFactory;
            let cellModel: ICellModel;

            switch (cell.cell_type) {
                case 'code':
                    cellModel = factory.createCodeCell({ cell });
                    break;
                case 'markdown':
                    cellModel = factory.createMarkdownCell({ cell });
                    break;
                case 'raw':
                    cellModel = factory.createRawCell({ cell });
                    break;
                default:
                    console.error('Unknown cell type', cell.cell_type);
                    return null;
            }

            this.pauseTracking = true;
            this.notebook.model.cells.insert(index, cellModel);
            this.pauseTracking = false;
        } else {
            throw new Error("Notebook or Model Null");            
        }

        return null;
    }

    public async removeCell(index: number) {
        console.log('removed cell at index', index);
        this.pauseTracking = true;
        if (this.notebook && this.notebook.model) {
            this.notebook.model.cells.remove(index);
        }
        this.pauseTracking = false;
        return null;
    }

    public async moveCell(fromIndex: number, toIndex: number) {
        console.log('moved cell to index', fromIndex, toIndex);

        this.pauseTracking = true;
        if (this.notebook && this.notebook.model) {
            this.notebook.model.cells.move(fromIndex, toIndex);
        } else {
            throw new Error("Notebook or Model Null");            
        }
        this.pauseTracking = false;

        return null;
    }

    public async setCell(index: number, cell: nbformat.ICell) {
        console.log('set cell at index', index, cell);

        this.pauseTracking = true;
        NotebookActions.changeCellType(this.notebook, cell.cell_type as nbformat.CellType);
        this.pauseTracking = false;

        return null;
    }

    public async changeActiveCell(index: number) {
        console.log('change active cell to index', index);

        this.pauseTracking = true;
        this.notebook.activeCellIndex = index;
        this.pauseTracking = false;

        return null;
    }

    public async cellValue(index: number, value: string) {        
        if (this.notebook && this.notebook.model) {
            const cell = this.notebook.model.cells.get(index);
            if (cell) {
                cell.value.text = value;
            }
        } else {
            throw new Error("Notebook or Model Null");            
        }
    }

    public async cellOutputs(index: number, outputs: nbformat.IOutput[]) {
        if (this.notebook && this.notebook.model) {
            const cell = this.notebook.widgets[index];        
            const cellModel = this.notebook.model.cells.get(index);
            if (cellModel) {
                switch (cellModel.type) {
                    case 'markdown':
                        (cell as MarkdownCell).rendered = true;
                        break;
                    case 'code':
                        (cellModel as CodeCellModel).outputs.fromJSON(outputs);
                        break;
                    default:
                        break;
                }
            }
        } else {
            throw new Error("Notebook or Model Null");            
        }
    }

    public async clearOutputs(index: number) {
        if (this.notebook && this.notebook.model) {
            const cell = this.notebook.widgets[index];
            const cellModel = this.notebook.model.cells.get(index);
            if (cellModel) {
                switch (cellModel.type) {
                    case 'markdown':
                        (cell as MarkdownCell).rendered = false;
                        break;
                    case 'code':
                        (cellModel as CodeCellModel).outputs.clear();
                        break;
                    default:
                        break;
                }
            }
        } else {
        throw new Error("Notebook or Model Null");            
    }
    }

    public async enableOutputScrolling(cellIndex: number) {
        this.pauseTracking = true;
        this.notebook.activeCellIndex = cellIndex;
        NotebookActions.enableOutputScrolling(this.notebook);
        this.pauseTracking = false;
        return null;
    }

    public async disableOutputScrolling(cellIndex: number) {
        this.pauseTracking = true;
        this.notebook.activeCellIndex = cellIndex;
        NotebookActions.disableOutputScrolling(this.notebook);
        this.pauseTracking = false;
        return null;
    }

    public async selectAll() {
        this.pauseTracking = true;
        NotebookActions.selectAll(this.notebook);
        this.pauseTracking = false;
        return null;
    }

    public async deselectAll() {
        this.pauseTracking = true;
        NotebookActions.deselectAll(this.notebook);
        this.pauseTracking = false;
        return null;
    }

    public async selectAbove(cellIndex: number) {
        this.pauseTracking = true;
        this.notebook.activeCellIndex = cellIndex;
        NotebookActions.selectAbove(this.notebook);
        this.pauseTracking = false;
        return null;
    }

    public async selectBelow(cellIndex: number) {
        this.pauseTracking = true;
        this.notebook.activeCellIndex = cellIndex;
        NotebookActions.selectBelow(this.notebook);
        this.pauseTracking = false;
        return null;
    }
}
