import * as vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  onDidChangeTreeData?: vscode.Event<vscode.TreeItem> | undefined;
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(
    element?: vscode.TreeItem
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    throw new Error("Method not implemented.");
  }
  getParent?(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
  resolveTreeItem?(
    item: vscode.TreeItem,
    element: vscode.TreeItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}
