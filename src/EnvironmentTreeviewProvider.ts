import * as vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<EnvironmentTreeItem>
{
  onDidChangeTreeData?: vscode.Event<EnvironmentTreeItem> | undefined;
  getTreeItem(
    element: EnvironmentTreeItem
  ): EnvironmentTreeItem | Thenable<EnvironmentTreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(
    element?: EnvironmentTreeItem
  ): vscode.ProviderResult<EnvironmentTreeItem[]> {
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
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      "dependency.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      "dependency.svg"
    ),
  };

  contextValue = "dependency";
}
