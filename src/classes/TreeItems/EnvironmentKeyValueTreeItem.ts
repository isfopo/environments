import * as vscode from "vscode";
import type { EnvironmentKeyValue } from "../../types";
import { EnvironmentFileTreeItem } from "./EnvironmentFileTreeItem";

export class EnvironmentKeyValueTreeItem extends vscode.TreeItem {
  constructor(
    public readonly key: string,
    public readonly value: EnvironmentKeyValue,
    public readonly parent: EnvironmentFileTreeItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(key, collapsibleState);
    this.contextValue = `keyValue-${this.value.type}`;
    this.tooltip = this.value.value;
    this.description = this.value.value;
  }
}
