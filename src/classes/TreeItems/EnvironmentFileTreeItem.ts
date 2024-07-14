import * as vscode from "vscode";
import type { EnvironmentContent } from "../../types";

export class EnvironmentFileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    public readonly uri: vscode.Uri,
    public readonly content: EnvironmentContent,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(name, collapsibleState);
    this.contextValue = "file";
    this.uri = uri;
    this.tooltip = this.uri.fsPath;
    this.iconPath = vscode.ThemeIcon.File;
  }
}
