import { JupyterLab, JupyterFrontEndPlugin, ILayoutRestorer } from '@jupyterlab/application';
import '../style/index.css';
import { Notebook, INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
// import { SideBar } from './side-bar';
import { NotebookProvenance } from './notebook-provenance';
import { ICommandPalette, MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import {CellHistoryPanel} from './cell-history-panel';
import './button-bar';
import { SideBar } from './side-bar';

/**
 * Initialization data for the jupyterlab_nbprovenance extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_nbprovenance',
  autoStart: true,
  requires: [ILayoutRestorer, INotebookTracker, ICommandPalette, IMainMenu, IRenderMimeRegistry],
  activate,
};

export default plugin;

export const notebookModelCache = new Map<Notebook, NotebookProvenance>();

function activate(app: JupyterLab, restorer: ILayoutRestorer, nbTracker: INotebookTracker,
    palette: ICommandPalette,
    mainMenu: IMainMenu,
    rendermime: IRenderMimeRegistry,
    launcher: ILauncher | null
  ): void {

  // Provenance Tree

  const provenanceViewCommand: string = 'provenanceView:open';
  let provenanceView: SideBar;
  palette.addItem({ command: provenanceViewCommand, category: 'Tutorial' });

  let sidebarTracker = new WidgetTracker({
    namespace: 'provenanceView'
  });
  restorer.restore(sidebarTracker, {
    command: provenanceViewCommand,
    name: () => 'provenanceView'
  });
  
  app.commands.addCommand(provenanceViewCommand, {
    label: 'Notebook Provenance View',
    execute: () => {
      if (!provenanceView) {
        provenanceView = new SideBar(app.shell, nbTracker);
        provenanceView.id = 'nbprovenance-view';
        provenanceView.title.caption = 'Notebook Provenance';
        provenanceView.title.iconClass = 'jp-nbprovenanceIcon';
      }

      if (!sidebarTracker.has(provenanceView)) {
        sidebarTracker.add(provenanceView);
      }
      if (!provenanceView.isAttached) {
        app.shell.add(provenanceView, 'right');
      }
      provenanceView.update();
    
      app.shell.activateById(provenanceView.id);
    }
  });

  // Cell History

  const cellHistorycommand: string = 'cellHistoryWidget:open';
  let cellHistoryWidget: MainAreaWidget<CellHistoryPanel>;
  palette.addItem({ command: cellHistorycommand, category: 'Tutorial' });

  let historyWidgetTracker = new WidgetTracker<MainAreaWidget<CellHistoryPanel>>({
    namespace: 'cellHistoryWidget'
  });
  restorer.restore(historyWidgetTracker, {
    command: cellHistorycommand,
    name: () => 'cellHistoryWidget'
  });
  
  app.commands.addCommand(cellHistorycommand, {
    label: 'Cell History',
    execute: () => {
      if (!cellHistoryWidget) {
        const content = new CellHistoryPanel(rendermime, app.shell, nbTracker);
        cellHistoryWidget = new MainAreaWidget({content});
        cellHistoryWidget.id = 'nbprovenance-cellhistory';
        cellHistoryWidget.title.label = 'Cell History View';
        cellHistoryWidget.title.closable = true;
      }

      if (!historyWidgetTracker.has(cellHistoryWidget)) {
        historyWidgetTracker.add(cellHistoryWidget);
      }
      if (!cellHistoryWidget.isAttached) {
        app.shell.add(cellHistoryWidget, 'main');
      }
      cellHistoryWidget.content.update();
    
      app.shell.activateById(cellHistoryWidget.id);
    }
  });
  
  // Add the notebook provenance connection to the tree view

  nbTracker.widgetAdded.connect((_: INotebookTracker, nbPanel: NotebookPanel) => {
    // wait until the session with the notebook model is ready
    nbPanel.sessionContext.ready.then(() => {
      const notebook: Notebook = nbPanel.content;
      if (!notebookModelCache.has(notebook)) {
        if (provenanceView && cellHistoryWidget) {
          const prov = new NotebookProvenance(notebook, nbPanel.context, provenanceView, cellHistoryWidget.content);
          notebookModelCache.set(notebook, prov );
        }
      }
    });
  });
}


