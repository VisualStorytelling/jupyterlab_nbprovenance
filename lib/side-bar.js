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
                    debugger;
                    this.summary.innerText = "Provenance of " + notebookProvenance.notebook.parent.context.path;
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
     * Handle update requests for the widget.
     */
    onUpdateRequest(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("onUpdateRequest");
            debugger;
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
    let eventConfig;
    eventConfig = createEventConfig(prov);
    let config = {
        cellsVisArea: 50,
        eventConfig: eventConfig,
    };
    trrack_vis_1.ProvVisCreator(document.getElementById("ProvDiv"), prov, visCallback, true, true, prov.graph().root, config);
}
exports.provVisUpdate = provVisUpdate;
function createEventConfig(prov) {
    function createRemoveSymbol() {
        // return "m1.00089,11.4262l11.3951,-10.42531l12.10485,11.07455l12.10484,-11.07455l11.39521,10.42531l-12.10485,11.07464l12.10485,11.07464l-11.39521,10.42541l-12.10484,-11.07465l-12.10485,11.07465l-11.3951,-10.42541l12.10474,-11.07464l-12.10474,-11.07464z";
        return "M10.19 7.5L15 12.31L12.31 15L7.5 10.19L2.69 15L0 12.31L4.81 7.5L0 2.69L2.69 0L7.5 4.81L12.31 0L15 2.69L10.19 7.5Z";
    }
    let symbols = [
        d3_shape_1.symbol().type(d3_shape_1.symbolDiamond)(),
        d3_shape_1.symbol().type(d3_shape_1.symbolCircle)(),
        d3_shape_1.symbol().type(d3_shape_1.symbolCross)(),
        // symbol().type(symbolWye)(),     // remove
        createRemoveSymbol(),
        d3_shape_1.symbol().type(d3_shape_1.symbolTriangle)(),
        d3_shape_1.symbol().type(d3_shape_1.symbolSquare)(),
        d3_shape_1.symbol().type(d3_shape_1.symbolStar)()
    ];
    { /*<g transform="scale(2)">*/ }
    // Find nodes in the clusters whose entire cluster is on the backbone.
    let conf = {};
    let counter = 0;
    for (let j of notebook_provenance_1.EventTypes) {
        conf[j] = {};
        conf[j].backboneGlyph = (React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: 'white',
                stroke: 'rgb(88, 22, 22)'
            }), d: symbols[counter] }));
        conf[j].bundleGlyph = (React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: 'white',
                stroke: 'rgb(88, 22, 22)'
            }), d: symbols[counter] }));
        conf[j].currentGlyph = (React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: 'rgb(88, 22, 22)',
                stroke: 'rgb(88, 22, 22)'
            }), d: symbols[counter] }));
        conf[j].regularGlyph = (React.createElement("path", { strokeWidth: 2, className: typestyle_1.style({
                fill: 'white',
                stroke: 'rgb(88, 22, 22)'
            }), d: symbols[counter] }));
        counter++;
    }
    return conf;
}
//# sourceMappingURL=side-bar.js.map