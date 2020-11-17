import { LabShell } from "@jupyterlab/application";
import { INotebookTracker, Notebook, NotebookPanel } from "@jupyterlab/notebook";

import { OutputAreaModel, SimplifiedOutputArea } from "@jupyterlab/outputarea";
import { IRenderMimeRegistry } from "@jupyterlab/rendermime";
import { Message } from "@lumino/messaging";
// import { Main } from "@lumino/widgets";

import { Provenance } from '@visdesignlab/trrack';
import { ApplicationExtra, ApplicationState, EventTypes, NotebookProvenance } from './notebook-provenance';

import { notebookModelCache } from '.';
// import { MainAreaWidget } from "@jupyterlab/apputils";
import { Widget } from "@lumino/widgets";
// import { ProvVisConfig } from "@visdesignlab/trrack-vis";

let notebookProvenance: NotebookProvenance | null;

/**
 * A panel with the ability to add other children.
 */
export class CellHistoryPanel extends Widget {
  prov: Provenance<unknown, String, unknown>;
  _outputarea: SimplifiedOutputArea;
  _outputareamodel: OutputAreaModel;

  constructor(
    rendermime: IRenderMimeRegistry,
    shell: LabShell,
    nbTracker: INotebookTracker
  ) {
    super();

    nbTracker.widgetAdded.connect((_: INotebookTracker, nbPanel: NotebookPanel) => {
      nbPanel.sessionContext.ready.then(() => {
        if (shell.currentWidget instanceof NotebookPanel && nbPanel === shell.currentWidget) {
          const notebook: Notebook = nbPanel.content;
          notebookProvenance = (notebookModelCache.has(notebook)) ? notebookModelCache.get(notebook)! : null;

          this.summary.innerText = "Provenance of " + (notebookProvenance!.notebook.parent! as NotebookPanel).context.path;
          
          this.update();
        }
      });
    });

    let topBar = document.createElement("div");
    this.node.appendChild(topBar);

    // Add a summary element to the topBar
    this.summary = document.createElement("p");
    this.summary.setAttribute("className","notebookTitle")
    topBar.appendChild(this.summary);
  }

  readonly summary: HTMLParagraphElement;

  async onUpdateRequest(msg: Message): Promise<void> {
    if (notebookProvenance) {
      this.summary.innerText = "Provenance of " + (notebookProvenance!.notebook.parent! as NotebookPanel).context.path;
      // console.log("this.prov!.current");

      // this.summary.innerText = this.prov!.current.name;
    }

  }

  protected onBeforeShow(msg: Message): void {
    console.log("onBeforeShow");
  }

  public dispose(): void {
    super.dispose();
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.dispose();
  }
}

// Create function to pass to the ProvVis library for when a node is selected in the graph.
// In this case: jump to clicked node
// let visCallback = function (newNode: NodeID) {
//   if (notebookProvenance) {
//     notebookProvenance.prov.goToNode(newNode);
//     // Incase the state doesn't change and the observers aren't called, updating the ProvVis here.
//     cellHistoryUpdate(notebookProvenance.prov);
//   }
// };

export function cellHistoryUpdate(prov: Provenance<ApplicationState, EventTypes, ApplicationExtra>) {
  console.log("UPDATING THE CELL HISTORY");
}
