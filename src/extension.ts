import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import { EnvironmentTreeviewProvider } from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  // Register the Sidebar Panel
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "environments-sidebar",
      sidebarProvider
    )
  );

  vscode.window.registerTreeDataProvider(
    "nodeDependencies",
    new EnvironmentTreeviewProvider()
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
