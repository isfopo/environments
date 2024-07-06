import * as vscode from "vscode";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<IEnvironmentTreeItem>
{
  onDidChangeTreeData?: vscode.Event<IEnvironmentTreeItem> | undefined;

  getTreeItem(
    element: IEnvironmentTreeItem
  ): IEnvironmentTreeItem | Thenable<IEnvironmentTreeItem> {
    return element;
  }
  getChildren(
    element?: IEnvironmentTreeItem
  ): vscode.ProviderResult<IEnvironmentTreeItem[]> {
    if (
      !vscode.workspace.workspaceFolders ||
      vscode.workspace.workspaceFolders?.length === 0
    ) {
      vscode.window.showInformationMessage(
        "No workspace found. Open workspace to see environment."
      );
      return Promise.resolve([]);
    }

    return Promise.resolve([
      new EnvironmentKeyValue(
        "envkey",
        "value",
        EnvironmentContentType.keyValue,
        vscode.TreeItemCollapsibleState.Collapsed
      ),
    ]);
  }
  getParent?(
    element: IEnvironmentTreeItem
  ): vscode.ProviderResult<IEnvironmentTreeItem> {
    throw new Error("Method not implemented.");
  }
  resolveTreeItem?(
    item: IEnvironmentTreeItem,
    element: IEnvironmentTreeItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<IEnvironmentTreeItem> {
    throw new Error("Method not implemented.");
  }
}

export class IEnvironmentTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly type: EnvironmentContentType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}

export enum EnvironmentContentType {
  file = "file",
  keyValue = "keyvalue",
}

export class EnvironmentKeyValue extends IEnvironmentTreeItem {
  constructor(
    public readonly label: string,
    public readonly value: string,
    public readonly type: EnvironmentContentType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, type, collapsibleState);
    this.tooltip = this.value;
    this.description = this.value;
  }
}

export class EnvironmentFile extends IEnvironmentTreeItem {
  constructor(
    public readonly name: string,
    public readonly type: EnvironmentContentType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(name, type, collapsibleState);
  }
}
