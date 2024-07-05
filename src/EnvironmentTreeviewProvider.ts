import * as vscode from "vscode";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<EnvironmentTreeItem>
{
  onDidChangeTreeData?: vscode.Event<EnvironmentTreeItem> | undefined;

  constructor(private workspaceRoot: string | undefined) {}

  getTreeItem(
    element: EnvironmentTreeItem
  ): EnvironmentTreeItem | Thenable<EnvironmentTreeItem> {
    return element;
  }
  getChildren(
    element?: EnvironmentTreeItem
  ): vscode.ProviderResult<EnvironmentTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage(
        "No workspace found. Open workspace to see environment."
      );
      return Promise.resolve([]);
    }
    throw new Error("Method not implemented.");
  }
  getParent?(
    element: EnvironmentTreeItem
  ): vscode.ProviderResult<EnvironmentTreeItem> {
    throw new Error("Method not implemented.");
  }
  resolveTreeItem?(
    item: EnvironmentTreeItem,
    element: EnvironmentTreeItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<EnvironmentTreeItem> {
    throw new Error("Method not implemented.");
  }
}

export class EnvironmentTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly key: string,
    private readonly value: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = this.value;
    this.description = this.key;
  }

  contextValue = "environment";
}
