import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import '../style/index.css';
import { Notebook } from '@jupyterlab/notebook';
import { NotebookProvenance } from './notebook-provenance-visdesignlab';
/**
 * Initialization data for the jupyterlab_nbprovenance extension.
 */
declare const plugin: JupyterFrontEndPlugin<void>;
export default plugin;
export declare const notebookModelCache: Map<Notebook, NotebookProvenance>;
