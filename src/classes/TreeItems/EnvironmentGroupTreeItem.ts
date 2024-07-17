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
    this.presets = presets;
    this.children = children;

    if (presets.length > 0) {
      this.contextValue = "group-has-presets";
    } else {
      this.contextValue = "group";
    }
  }
}
