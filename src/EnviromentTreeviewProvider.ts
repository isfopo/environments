import * as vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<any>
{
  onDidChangeTreeData?: vscode.Event<any> | undefined;
  getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(element?: any): vscode.ProviderResult<any[]> {
    throw new Error("Method not implemented.");
  }
  getParent?(element: any) {
    throw new Error("Method not implemented.");
  }
  resolveTreeItem?(
    item: vscode.TreeItem,
    element: any,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}
