"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { NotebookPanel, Notebook, INotebookTracker } from '@jupyterlab/notebook';
// import { notebookModelCache } from '.';
const widgets_1 = require("@lumino/widgets");
require("./action-listener");
// import { ProvenanceGraphTraverser } from '@visualstorytelling/provenance-core';
require("../style/side-bar.css");
// import {initProvenance} from '@visdesignlab/provenance-lib-core/src';
const provenance_lib_core_1 = require("@visdesignlab/provenance-lib-core");
// import Scatterplot from "./scatterplot"
// import ReactDOM from 'react-dom'
// import * as d3 from "d3"
// import {
//     ProvVis,
//     EventConfig,
//     Config,
//     ProvVisConfig,
//     ProvVisCreator
// } from "@visdesignlab/provvis";
const provvis_1 = require("../ProvVis/provvis");
/**
 * Initial state
 */
const initialState = {
    selectedCell: "none"
};
// initialize provenance with the first state
let prov = provenance_lib_core_1.initProvenance(initialState, false);
/**
 * Function called when a cell is selected. Applies an action to provenance.
 */
let selectCellUpdate = function (newSelected) {
    let action = prov.addAction(newSelected + " Selected", (state) => {
        state.selectedCell = newSelected;
        return state;
    });
    action
        .addEventType("select cell")
        .applyAction();
};
// /**
//  * Observer for when the selected node state is changed. Calls selectNode in scatterplot to update vis.
//  */
// prov.addObserver(["selectedNode"], () => {
//     scatterplot.selectNode(prov.current().getState().selectedNode);
//
//     console.log("select obs called")
//
//     provVisUpdate()
//
// });
// Setup ProvVis once initially
// provVisUpdate();
// Create function to pass to the ProvVis library for when a node is selected in the graph.
// For our purposes, were simply going to jump to the selected node.
let visCallback = function (newNode) {
    prov.goToNode(newNode);
    // Incase the state doesn't change and the observers arent called, updating the ProvVis here.
    // provVisUpdate();
};
/**
 * The main view for the notebook provenance.
 */
class SideBar extends widgets_1.Widget {
    constructor(shell) {
        super();
        this.addClass("jp-nbprovenance-view");
        // Add a summary element to the panel
        this.summary = document.createElement("p");
        this.node.appendChild(this.summary);
        // Add the provenance div
        this.provtree = document.createElement("div");
        this.provtree.className = "ProvDiv";
        this.node.appendChild(this.provtree);
        // tslint:disable-next-line:no-debugger
        // tslint:disable-next-line:no-unused-expression
        prov;
        selectCellUpdate("thisIsTheNewSelect");
        // tslint:disable-next-line:no-unused-expression
        prov;
        provVisUpdate();
    }
    /**
     * Handle update requests for the widget.
     */
    onUpdateRequest(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.summary.innerText = "qwert";
        });
    }
    /**
     * Called after the widget is attached to the DOM
     *
     * Make sure the widget is rendered, even if the model has not changed.
     */
    onAfterAttach(msg) {
        this.update();
    }
}
exports.SideBar = SideBar;
function provVisUpdate() {
    debugger;
    document.getElementById("ProvDiv");
    console.log("AY HERE");
    provvis_1.ProvVisCreator(document.getElementById("ProvDiv"), prov, visCallback);
}
//# sourceMappingURL=side-bar.js.map