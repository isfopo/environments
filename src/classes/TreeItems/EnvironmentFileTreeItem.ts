import * as vscode from "vscode";
import { EnvironmentGroupTreeItem } from "./EnvironmentGroupTreeItem";
import { EnvironmentKeyValueTreeItem } from "./EnvironmentKeyValueTreeItem";

export class EnvironmentFileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    public readonly uri: vscode.Uri,
    public readonly children: Array<
      EnvironmentGroupTreeItem | EnvironmentKeyValueTreeItem
    >,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(name, collapsibleState);
    this.contextValue = "file";
    this.uri = uri;
    this.tooltip = this.uri.fsPath;
    this.iconPath = vscode.ThemeIcon.File;
  }

  getDir(): vscode.Uri {
    return vscode.Uri.joinPath(
      this.uri.with({
        path: this.uri.path.substring(0, this.uri.path.lastIndexOf("/")),
      })
    );
  }
}
