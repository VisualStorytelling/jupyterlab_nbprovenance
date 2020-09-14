import { ApplicationExtra, ApplicationState, EventTypes } from './notebook-provenance';
import { LabShell } from "@jupyterlab/application";
import { INotebookTracker } from '@jupyterlab/notebook';
import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";
import "../style/side-bar.css";
import { Provenance } from "@visdesignlab/trrack";
/**
 * The main view for the notebook provenance.
 */
export declare class SideBar extends Widget {
    constructor(shell: LabShell, nbTracker: INotebookTracker);
    /**
     * The summary text element associated with the widget.
     */
    readonly summary: HTMLParagraphElement;
    /**
     * The summary text element associated with the widget.
     */
    readonly provtree: HTMLDivElement;
    /**
     * Handle update requests for the widget.
     */
    onUpdateRequest(msg: Message): Promise<void>;
    /**
     * A message handler invoked on a `'before-show'` message.
     *
     * #### Notes
     * The default implementation of this handler is a no-op.
     */
    protected onBeforeShow(msg: Message): void;
}
export declare function provVisUpdate(prov: Provenance<ApplicationState, EventTypes, ApplicationExtra>): void;
