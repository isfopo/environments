import * as vscode from "vscode";
import { parseEnvironmentContent, replace } from "./helpers/parse";
import { EnvironmentWorkspaceFolderTreeItem } from "./classes/TreeItems/EnvironmentWorkspaceFolderTreeItem";
import { EnvironmentKeyValueTreeItem } from "./classes/TreeItems/EnvironmentKeyValueTreeItem";
import { EnvironmentFileTreeItem } from "./classes/TreeItems/EnvironmentFileTreeItem";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  context: vscode.ExtensionContext;

  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  register() {
    const trees = [
      vscode.window.createTreeView("environments-sidebar", {
        treeDataProvider: this,
      }),
      vscode.window.createTreeView("environments-explorer", {
        treeDataProvider: this,
      }),
    ];

    for (const tree of trees) {
      tree.onDidChangeSelection(async (e): Promise<void> => {
        const selected = e.selection[0];
        if (selected instanceof EnvironmentKeyValueTreeItem) {
          await vscode.window.showTextDocument(
            await vscode.workspace.openTextDocument(selected.parent.uri)
          );
        }
      });
    }

    // Listen to file changes
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.path.includes(".env")) {
        this.refresh();
      }
    });

    // Listen to file creation
    vscode.workspace.onDidCreateFiles((event) => {
      for (const file of event.files) {
        if (file.path.includes(".env")) {
          this.refresh();
        }
      }
    });

    // Listen to file deletion
    vscode.workspace.onDidDeleteFiles((event) => {
      for (const file of event.files) {
        if (file.path.includes(".env")) {
          this.refresh();
        }
      }
    });

    // Listen to file renaming
    vscode.workspace.onDidRenameFiles((event) => {
      for (const file of event.files) {
        if (
          file.newUri.path.includes(".env") ||
          file.oldUri.path.includes(".env")
        ) {
          this.refresh();
        }
      }
    });
    return this;
  }

  async create(workspace: string, fileName: string) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(
        vscode.Uri.from({
          path: workspace,
          scheme: "file",
        }),
        fileName
      ),
      new Uint8Array()
    );
    this.refresh();
  }

  async add(element: EnvironmentFileTreeItem, key: string, value: string) {
    let content = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(element.uri)
    );

    content += `${key}="${value}"\n`;

    await vscode.workspace.fs.writeFile(
      element.uri,
      new TextEncoder().encode(content)
    );

    this.refresh();
  }

  flip(element: EnvironmentKeyValueTreeItem) {
    this.edit(element, element.value.value === "true" ? "false" : "true");
  }

  refresh() {
    this._onDidChangeTreeData?.fire();
  }

  async edit(element: EnvironmentKeyValueTreeItem, input: string) {
    const content = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(element.parent.uri)
    );

    await vscode.workspace.fs.writeFile(
      element.parent.uri,
      new TextEncoder().encode(replace(content, element.key, input))
    );

    this.refresh();
  }

  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: vscode.TreeItem
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (
      !vscode.workspace.workspaceFolders ||
      vscode.workspace.workspaceFolders?.length === 0
    ) {
      vscode.window.showInformationMessage(
        "No workspace found. Open workspace to see environment."
      );
      return Promise.resolve([]);
    }

    if (!element) {
      if (vscode.workspace.workspaceFolders.length > 1) {
        return vscode.workspace.workspaceFolders.map(
          (folder) => new EnvironmentWorkspaceFolderTreeItem(folder)
        );
      } else {
        return this.getFileData(vscode.workspace.workspaceFolders[0]);
      }
    } else if (element instanceof EnvironmentWorkspaceFolderTreeItem) {
      return this.getFileData(element.folder);
    } else if (element instanceof EnvironmentFileTreeItem) {
      return Promise.resolve(
        Object.keys(element.content).map(
          (key): EnvironmentKeyValueTreeItem =>
            new EnvironmentKeyValueTreeItem(key, element.content[key], element)
        )
      );
    }
  }

  private async getFileData(
    folder: vscode.WorkspaceFolder
  ): Promise<EnvironmentFileTreeItem[]> {
    const files = (await vscode.workspace.fs.readDirectory(folder.uri)).filter(
      (file) => file[0].startsWith(".env")
    );

    const fileUris = files.map((file) =>
      vscode.Uri.joinPath(folder.uri, file[0])
    );

    const fileContents = await Promise.all(
      fileUris.map((uri) => vscode.workspace.fs.readFile(uri))
    );

    const fileContentStrings = fileContents.map((content) =>
      new TextDecoder().decode(content)
    );

    return files.map(
      ([path], index) =>
        new EnvironmentFileTreeItem(
          path,
          fileUris[index],
          parseEnvironmentContent(fileContentStrings[index])
        )
    );
  }
}
