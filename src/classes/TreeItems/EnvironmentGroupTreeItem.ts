import * as vscode from "vscode";
import { EnvironmentKeyValueTreeItem } from "./EnvironmentKeyValueTreeItem";

export class EnvironmentGroupTreeItem extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    public readonly presets: string[],
    public readonly children: EnvironmentKeyValueTreeItem[] = [],
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(name, collapsibleState);
    this.contextValue = "group";
    this.presets = presets;
    this.children = children;
  }
}
