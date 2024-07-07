import * as vscode from "vscode";
import { EnvironmentTreeviewProvider } from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  // Register the Sidebar Panel
  const treeDataProvider = new EnvironmentTreeviewProvider();
  vscode.window.createTreeView("environments-sidebar", {
    treeDataProvider,
  });

  vscode.commands.registerCommand("environments.refresh", () =>
    treeDataProvider.refresh()
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
