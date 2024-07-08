import * as vscode from "vscode";
import {
  EnvironmentKeyValueTreeItem,
  EnvironmentTreeviewProvider,
} from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  // Register the Sidebar Panel
  const treeDataProvider = new EnvironmentTreeviewProvider();
  vscode.window.createTreeView("environments-sidebar", {
    treeDataProvider,
  });

  vscode.commands.registerCommand("environments.refresh", () =>
    treeDataProvider.refresh()
  );

  vscode.commands.registerCommand(
    "environments.edit",
    async ({ key, value: { value } }: EnvironmentKeyValueTreeItem) => {
      const input = await vscode.window.showInputBox({
        value,
        prompt: `Update the value for ${key}`,
      });
      console.log(input);
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
