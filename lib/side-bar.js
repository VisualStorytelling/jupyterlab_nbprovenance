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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const notebook_provenance_1 = require("./notebook-provenance");
const notebook_1 = require("@jupyterlab/notebook");
const _1 = require(".");
const widgets_1 = require("@lumino/widgets");
require("../style/side-bar.css");
const trrack_vis_1 = require("@visdesignlab/trrack-vis");
const d3_shape_1 = require("d3-shape");
const React = __importStar(require("react"));
const typestyle_1 = require("typestyle");
let notebookProvenance;
let eventConfig;
/**
 * The main view for the notebook provenance.
 */
class SideBar extends widgets_1.Widget {
    constructor(shell, nbTracker) {
        super();
        this.addClass("jp-nbprovenance-view");
        nbTracker.widgetAdded.connect((_, nbPanel) => {
            // wait until the session with the notebook model is ready
            nbPanel.sessionContext.ready.then(() => {
                // update provenance information only for the current widget
                if (shell.currentWidget instanceof notebook_1.NotebookPanel && nbPanel === shell.currentWidget) {
                    const notebook = nbPanel.content;
                    notebookProvenance = (_1.notebookModelCache.has(notebook)) ? _1.notebookModelCache.get(notebook) : null;
                    this.summary.innerText = "Provenance of " + notebookProvenance.notebook.parent.context.path;
                    if (notebookProvenance) {
                        eventConfig = createEventConfig(notebookProvenance.prov);
                    }
                    this.update();
                }
            });
        });
        let topBar = document.createElement("div");
        this.node.appendChild(topBar);
        // Add a summary element to the topBar
        this.summary = document.createElement("p");
        this.summary.setAttribute("className", "notebookTitle");
        topBar.appendChild(this.summary);
        // just testing FontAwesome
        // let image = document.createElement("i");
        // image.className = "fas fa-arrows-alt";
        // image.setAttribute("style","color: red")
        // topBar.appendChild(image);
        // Add the provenance div
        this.provtree = document.createElement("div");
        this.provtree.id = "ProvDiv";
        this.node.appendChild(this.provtree);
    }
    /**
     * Handle update requests for the widget.
     */
    onUpdateRequest(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("onUpdateRequest");
            if (notebookProvenance) {
                provVisUpdate(notebookProvenance.prov);
            }
        });
    }
    /**
     * A message handler invoked on a `'before-show'` message.
     *
     * #### Notes
     * The default implementation of this handler is a no-op.
     */
    onBeforeShow(msg) {
        console.log("onBeforeShow");
        if (notebookProvenance) {
            provVisUpdate(notebookProvenance.prov);
        }
    }
}
exports.SideBar = SideBar;
// Create function to pass to the ProvVis library for when a node is selected in the graph.
// In this case: jump to clicked node
let visCallback = function (newNode) {
    if (notebookProvenance) {
        notebookProvenance.prov.goToNode(newNode);
        // Incase the state doesn't change and the observers aren't called, updating the ProvVis here.
        provVisUpdate(notebookProvenance.prov);
    }
};
function provVisUpdate(prov) {
    console.log("UPDATING THE VISUALIZATION");
    let config = {
        cellsVisArea: 50,
        eventConfig: eventConfig,
        legend: true,
        filters: true
        // maxNumberOfCells: notebookProvenance!.notebook.model!.cells.length
    };
    trrack_vis_1.ProvVisCreator(document.getElementById("ProvDiv"), prov, visCallback, true, true, prov.graph().root, config);
}
exports.provVisUpdate = provVisUpdate;
function createEventConfig(prov) {
    console.log("Create eventConfig");
    // function createRemoveSymbol() {
    //   // return "m1.00089,11.4262l11.3951,-10.42531l12.10485,11.07455l12.10484,-11.07455l11.39521,10.42531l-12.10485,11.07464l12.10485,11.07464l-11.39521,10.42541l-12.10484,-11.07465l-12.10485,11.07465l-11.3951,-10.42541l12.10474,-11.07464l-12.10474,-11.07464z";
    //   return "M10.19 7.5L15 12.31L12.31 15L7.5 10.19L2.69 15L0 12.31L4.81 7.5L0 2.69L2.69 0L7.5 4.81L12.31 0L15 2.69L10.19 7.5Z";
    // }
    //
    // function createMoveSymbol(){
    //
    //   return "M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z";
    // }
    // let transform = "scale (0.035) translate (-200,-200)";
    // function changeSymbol(current: boolean){
    //   return <path
    //     strokeWidth={30}
    //     className={style({
    //       fill: current ? 'rgb(33, 133, 208)' : 'white',
    //       stroke: 'rgb(33, 133, 208)'
    //     })}
    //     transform="scale (0.035) translate (-200,-200)"
    //     d="M0 352a160 160 0 0 0 160 160h64a160 160 0 0 0 160-160V224H0zM176 0h-16A160 160 0 0 0 0 160v32h176zm48 0h-16v192h176v-32A160 160 0 0 0 224 0z"
    //   />
    // }
    function changeSymbol(current) {
        return React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), d: d3_shape_1.symbol().type(d3_shape_1.symbolCircle)() });
    }
    function executeSymbol(current) {
        return React.createElement("path", { strokeWidth: 30, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), transform: "scale (0.035) translate (-250,-250)", d: "M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z" });
    }
    function addSymbol(current) {
        return React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), d: d3_shape_1.symbol().type(d3_shape_1.symbolCross).size(125)() });
    }
    function removeSymbol(current) {
        return React.createElement("path", { strokeWidth: 30, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), transform: "scale (0.035) translate (-220,-220)", d: "M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" });
    }
    function moveSymbol(current) {
        return React.createElement("path", { strokeWidth: 30, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), transform: "scale (0.035) translate (-260,-260)", d: "M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z" });
    }
    function setSymbol(current) {
        return React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), d: d3_shape_1.symbol().type(d3_shape_1.symbolTriangle).size(100)() });
    }
    function changeCellValueSymbol(current) {
        return React.createElement("path", { strokeWidth: 30, className: typestyle_1.style({
                fill: current ? 'rgb(33, 133, 208)' : 'white',
                stroke: 'rgb(33, 133, 208)'
            }), transform: "scale (0.035) translate (-260,-260)", d: "M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" });
    }
    let conf = {};
    for (let j of notebook_provenance_1.EventTypes) {
        conf[j] = {};
    }
    // change
    conf[notebook_provenance_1.EventTypes[0]].backboneGlyph = changeSymbol(false);
    conf[notebook_provenance_1.EventTypes[0]].currentGlyph = changeSymbol(true);
    conf[notebook_provenance_1.EventTypes[0]].bundleGlyph = conf[notebook_provenance_1.EventTypes[0]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[0]].regularGlyph = conf[notebook_provenance_1.EventTypes[0]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[0]].description = "The active cell has been changed";
    // execute
    conf[notebook_provenance_1.EventTypes[1]].backboneGlyph = executeSymbol(false);
    conf[notebook_provenance_1.EventTypes[1]].currentGlyph = executeSymbol(true);
    conf[notebook_provenance_1.EventTypes[1]].bundleGlyph = conf[notebook_provenance_1.EventTypes[1]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[1]].regularGlyph = conf[notebook_provenance_1.EventTypes[1]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[1]].description = "A cell has been executed";
    // add
    conf[notebook_provenance_1.EventTypes[2]].backboneGlyph = addSymbol(false);
    conf[notebook_provenance_1.EventTypes[2]].currentGlyph = addSymbol(true);
    conf[notebook_provenance_1.EventTypes[2]].bundleGlyph = conf[notebook_provenance_1.EventTypes[2]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[2]].regularGlyph = conf[notebook_provenance_1.EventTypes[2]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[2]].description = "A new cell has been added";
    // remove
    conf[notebook_provenance_1.EventTypes[3]].backboneGlyph = removeSymbol(false);
    conf[notebook_provenance_1.EventTypes[3]].currentGlyph = removeSymbol(true);
    conf[notebook_provenance_1.EventTypes[3]].bundleGlyph = conf[notebook_provenance_1.EventTypes[3]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[3]].regularGlyph = conf[notebook_provenance_1.EventTypes[3]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[3]].description = "A cell has been removed";
    // move
    conf[notebook_provenance_1.EventTypes[4]].backboneGlyph = moveSymbol(false);
    conf[notebook_provenance_1.EventTypes[4]].currentGlyph = moveSymbol(true);
    conf[notebook_provenance_1.EventTypes[4]].bundleGlyph = conf[notebook_provenance_1.EventTypes[4]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[4]].regularGlyph = conf[notebook_provenance_1.EventTypes[4]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[4]].description = "A cell has been moved";
    // set
    conf[notebook_provenance_1.EventTypes[5]].backboneGlyph = setSymbol(false);
    conf[notebook_provenance_1.EventTypes[5]].currentGlyph = setSymbol(true);
    conf[notebook_provenance_1.EventTypes[5]].bundleGlyph = conf[notebook_provenance_1.EventTypes[5]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[5]].regularGlyph = conf[notebook_provenance_1.EventTypes[5]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[5]].description = "The type of a cell has been changed";
    // changeCellValue
    conf[notebook_provenance_1.EventTypes[6]].backboneGlyph = changeCellValueSymbol(false);
    conf[notebook_provenance_1.EventTypes[6]].currentGlyph = changeCellValueSymbol(true);
    conf[notebook_provenance_1.EventTypes[6]].bundleGlyph = conf[notebook_provenance_1.EventTypes[6]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[6]].regularGlyph = conf[notebook_provenance_1.EventTypes[6]].backboneGlyph;
    conf[notebook_provenance_1.EventTypes[6]].description = "The value of a cell has been changed";
    return conf;
}
//# sourceMappingURL=side-bar.js.map