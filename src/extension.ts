import * as vscode from "vscode";
import { EnvironmentTreeviewProvider } from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  // Register the Sidebar Panel
  vscode.window.createTreeView("Environment Explorer", {
    treeDataProvider: new EnvironmentTreeviewProvider(),
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
