import * as vscode from "vscode";
import { EnvironmentTreeviewProvider } from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // Register the Sidebar Panel
  vscode.window.createTreeView("environments-sidebar", {
    treeDataProvider: new EnvironmentTreeviewProvider(rootPath),
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
