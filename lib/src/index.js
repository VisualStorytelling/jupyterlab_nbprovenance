"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("@jupyterlab/application");
require("../style/index.css");
const notebook_1 = require("@jupyterlab/notebook");
const side_bar_1 = require("./side-bar");
const notebook_provenance_visdesignlab_1 = require("./notebook-provenance-visdesignlab");
/**
 * Initialization data for the jupyterlab_nbprovenance extension.
 */
const plugin = {
    id: 'jupyterlab_nbprovenance',
    autoStart: true,
    requires: [application_1.ILayoutRestorer, notebook_1.INotebookTracker],
    activate,
};
exports.default = plugin;
exports.notebookModelCache = new Map();
function activate(app, restorer, nbTracker) {
    nbTracker.widgetAdded.connect((_, nbPanel) => {
        // wait until the session with the notebook model is ready
        nbPanel.sessionContext.ready.then(() => {
            const notebook = nbPanel.content;
            if (!exports.notebookModelCache.has(notebook)) {
                exports.notebookModelCache.set(notebook, new notebook_provenance_visdesignlab_1.NotebookProvenance(app, notebook, nbPanel.sessionContext));
            }
        });
    });
    const provenanceView = new side_bar_1.SideBar(app.shell);
    provenanceView.id = 'nbprovenance-view';
    provenanceView.title.caption = 'Notebook Provenance';
    provenanceView.title.iconClass = 'jp-nbprovenanceIcon';
    // @ts-ignore
    restorer.add(provenanceView, 'nbprovenance_view');
    // Rank has been chosen somewhat arbitrarily
    // app.shell.addToLeftArea(provenanceView, { rank: 700 }); // this has been reworked
    // @ts-ignore
    app.shell.add(provenanceView, 'right', { rank: 700 });
}
//# sourceMappingURL=index.js.map