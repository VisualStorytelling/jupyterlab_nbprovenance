import { JupyterLab, JupyterFrontEndPlugin, ILayoutRestorer } from '@jupyterlab/application';
import '../style/index.css';
import { NotebookPanel, Notebook, INotebookTracker } from '@jupyterlab/notebook';
import { SideBar } from './side-bar';
import { NotebookProvenance } from './notebook-provenance';
import {Widget, Menu} from '@lumino/widgets';
import { ICommandPalette, InputDialog } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import {ExamplePanel} from './cell-history-panel';

/**
 * The command IDs used by the console plugin.
 */
// tslint:disable-next-line:no-namespace
namespace CommandIDs {
  export const create = 'kernel-output:create';
  export const execute = 'kernel-output:execute';
}

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
  let provenanceView: Widget;
  nbTracker.widgetAdded.connect((_: INotebookTracker, nbPanel: NotebookPanel) => {
    // wait until the session with the notebook model is ready
    nbPanel.sessionContext.ready.then(() => {
      const notebook: Notebook = nbPanel.content;
      if (!notebookModelCache.has(notebook)) {
        notebookModelCache.set(notebook, new NotebookProvenance(notebook, nbPanel.context, provenanceView));
      }
    });
  });

  provenanceView = new SideBar(app.shell, nbTracker);
  provenanceView.id = 'nbprovenance-view';
  provenanceView.title.caption = 'Notebook Provenance';
  provenanceView.title.iconClass = 'jp-nbprovenanceIcon';
  restorer.add(provenanceView, 'nbprovenance_view');
  app.shell.add(provenanceView, 'right', {rank: 700}); // rank was chosen arbitrarily

  const manager = app.serviceManager;
  const { commands, shell } = app;
  const category = 'Extension Examples';

  let panel: ExamplePanel;

  /**
   * Creates a example panel.
   *
   * @returns The panel
   */
  async function createPanel(): Promise<ExamplePanel> {
    panel = new ExamplePanel(manager, rendermime);
    shell.add(panel, 'main');
    return panel;
  }

  // add menu tab
  const exampleMenu = new Menu({ commands });
  exampleMenu.title.label = 'Cell History';
  mainMenu.addMenu(exampleMenu);

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: 'Open the Cell History Panel',
    caption: 'Open the Cell History Panel',
    execute: createPanel
  });

  commands.addCommand(CommandIDs.execute, {
    label: 'Contact Kernel and Execute Code',
    caption: 'Contact Kernel and Execute Code',
    execute: async () => {
      // Create the panel if it does not exist
      if (!panel) {
        await createPanel();
      }
      // Prompt the user about the statement to be executed
      const input = await InputDialog.getText({
        title: 'Code to execute',
        okLabel: 'Execute',
        placeholder: 'Statement to execute'
      });
      // Execute the statement
      if (input.button.accept) {
        const code = input.value;
        if (code !== null) {
          panel.execute(code);
        }
      }
    }
  });

  // add items in command palette and menu
  [CommandIDs.create, CommandIDs.execute].forEach(command => {
    palette.addItem({ command, category });
    exampleMenu.addItem({ command });
  });

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category
    });
  }
}


