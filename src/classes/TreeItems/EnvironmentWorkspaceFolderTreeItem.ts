import * as vscode from "vscode";

export class EnvironmentWorkspaceFolderTreeItem extends vscode.TreeItem {
  constructor(
    public readonly folder: vscode.WorkspaceFolder,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(folder.name, collapsibleState);
    this.contextValue = "workspaceFolder";
    this.tooltip = this.folder.uri.fsPath;
    this.iconPath = vscode.ThemeIcon.Folder;
  }
}
