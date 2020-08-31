import { LabShell } from "@jupyterlab/application";
import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";
import "./action-listener";
import "../style/side-bar.css";
/**
 * interface representing the state of the application
 */
export interface INodeState {
    selectedCell: string;
}
/**
 * The main view for the notebook provenance.
 */
export declare class SideBar extends Widget {
    constructor(shell: LabShell);
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
     * Called after the widget is attached to the DOM
     *
     * Make sure the widget is rendered, even if the model has not changed.
     */
    protected onAfterAttach(msg: Message): void;
}
