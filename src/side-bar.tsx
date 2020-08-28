"use strict";
import {EventTypes, NotebookProvenance} from './notebook-provenance';
import { LabShell } from "@jupyterlab/application";
import { NotebookPanel, Notebook, INotebookTracker } from '@jupyterlab/notebook';
import { notebookModelCache } from '.';
import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";
import "../style/side-bar.css";
import
{
    Provenance,
    NodeID
} from "@visdesignlab/trrack";

import {
  EventConfig,
  ProvVisConfig,
  ProvVisCreator
} from "@visdesignlab/trrack-vis";

import {
    symbol,
    symbolCircle,
    symbolCross,
    symbolDiamond,
    symbolSquare,
    symbolStar,
    symbolTriangle,
    // symbolWye
} from "d3-shape";
import * as React from "react";
import {style} from "typestyle";



let notebookProvenance: NotebookProvenance | null;

/**
 * The main view for the notebook provenance.
 */
export class SideBar extends Widget {

    // private notebookProvenance: NotebookProvenance | null = null;

    constructor(shell: LabShell, nbTracker: INotebookTracker) {
        super();

        this.addClass("jp-nbprovenance-view");

        nbTracker.widgetAdded.connect((_: INotebookTracker, nbPanel: NotebookPanel) => {
            // wait until the session with the notebook model is ready
            nbPanel.sessionContext.ready.then(() => {
                // update provenance information only for the current widget
                if (shell.currentWidget instanceof NotebookPanel && nbPanel === shell.currentWidget) {
                    const notebook: Notebook = nbPanel.content;
                    notebookProvenance = (notebookModelCache.has(notebook)) ? notebookModelCache.get(notebook)! : null;
                    this.update();
                }
            });
        });

        let topBar = document.createElement("div");
        this.node.appendChild(topBar);

        // Add a summary element to the topBar
        this.summary = document.createElement("p");
        topBar.appendChild(this.summary);

        // Add the provenance div
        this.provtree = document.createElement("div");
        this.provtree.id = "ProvDiv";
        this.node.appendChild(this.provtree);
    }

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
    async onUpdateRequest(msg: Message): Promise<void> {

        // @ts-ignore
        this.summary.innerText = "Provenance of " + (notebookProvenance.notebook.parent! as NotebookPanel).context.path;
        // @ts-ignore
        provVisUpdate(notebookProvenance.prov);
    }
    // /**
    //  * Called after the widget is attached to the DOM
    //  *
    //  * Make sure the widget is rendered, even if the model has not changed.
    //  */
    // protected onAfterAttach(msg: Message): void {
    //     // d3.select("#ProvDiv")
    //     //   .append("button")
    //     //   .text("undo")
    //     //   .on("click", () => {
    //     //       // @ts-ignore
    //     //       this.notebookProvenance.prov.goBackOneStep();
    //     //   });
    //     // this.update();
    //     // @ts-ignore
    //     // provVisUpdate(notebookProvenance.prov);
    // }
}

// Create function to pass to the ProvVis library for when a node is selected in the graph.
// For our purposes, were simply going to jump to the selected node.
let visCallback = function(newNode: NodeID) {
    // @ts-ignore
    notebookProvenance.prov.goToNode(newNode);
    // Incase the state doesn't change and the observers arent called, updating the ProvVis here.
    // @ts-ignore
    provVisUpdate(notebookProvenance.prov);
};

export function provVisUpdate(prov: Provenance<unknown, string, unknown>) {
    // console.log("UPDATING THE VISUALIZATION");
    let eventConfig: EventConfig<any>;
    eventConfig = createEventConfig(prov);

    let config: ProvVisConfig = {
        cellsVisArea: 50,
        eventConfig: eventConfig
    };




    ProvVisCreator(
      document.getElementById("ProvDiv")!,
      prov,
      visCallback,
      true,
      true,
      prov.graph().root,
      config
      );
}


function createEventConfig<E extends string>(prov: Provenance<unknown, string, unknown>): EventConfig<E> {
  function createRemoveSymbol() {
    // return "m1.00089,11.4262l11.3951,-10.42531l12.10485,11.07455l12.10484,-11.07455l11.39521,10.42531l-12.10485,11.07464l12.10485,11.07464l-11.39521,10.42541l-12.10484,-11.07465l-12.10485,11.07465l-11.3951,-10.42541l12.10474,-11.07464l-12.10474,-11.07464z";
    return "M10.19 7.5L15 12.31L12.31 15L7.5 10.19L2.69 15L0 12.31L4.81 7.5L0 2.69L2.69 0L7.5 4.81L12.31 0L15 2.69L10.19 7.5Z";
  }

  let symbols = [
    symbol().type(symbolDiamond)()!, // change
    symbol().type(symbolCircle)()!,  // execute
    symbol().type(symbolCross)()!,   // add
    // symbol().type(symbolWye)(),     // remove
    createRemoveSymbol(),
    symbol().type(symbolTriangle)()!,// move
    symbol().type(symbolSquare)()!,  // set
    symbol().type(symbolStar)()!
  ];




  {/*<g transform="scale(2)">*/}

  // Find nodes in the clusters whose entire cluster is on the backbone.
  let conf: EventConfig<E> = {};
  let counter = 0;

  for (let j of EventTypes) {
    conf[j] = {}
    conf[j].backboneGlyph = (
      <path
        strokeWidth={2}
        className={style({
          fill: 'white',
          stroke: 'rgb(88, 22, 22)'
        })}
        d={symbols[counter]}
      />
    )

    conf[j].bundleGlyph = (
      <path
        strokeWidth={2}
        className={style({
          fill: 'white',
          stroke: 'rgb(88, 22, 22)'
        })}
        d={symbols[counter]}
      />
    )

    conf[j].currentGlyph = (
      <path
        strokeWidth={2}
        className={style({
          fill: 'rgb(88, 22, 22)',
          stroke: 'rgb(88, 22, 22)'
        })}
        d={symbols[counter]}
      />
    )

    conf[j].regularGlyph = (
      <path
        strokeWidth={2}
        className={style({
          fill: 'white',
          stroke: 'rgb(88, 22, 22)'
        })}
        d={symbols[counter]}
      />
    )

    counter++;
  }
  return conf;
}
