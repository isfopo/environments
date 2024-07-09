import * as vscode from "vscode";
import {
  EnvironmentKeyValueTreeItem,
  EnvironmentTreeviewProvider,
} from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new EnvironmentTreeviewProvider();
  vscode.window.createTreeView("environments-sidebar", {
    treeDataProvider,
  });

  vscode.commands.registerCommand("environments.refresh", () =>
    treeDataProvider.refresh()
  );

  vscode.commands.registerCommand(
    "environments.edit",
    async (element: EnvironmentKeyValueTreeItem) => {
      if (element.value.type === "bool") {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = [{ label: "true" }, { label: "false" }];
        quickPick.onDidHide(() => quickPick.dispose());

        quickPick.placeholder = `Update the value for ${element.key}`;
        quickPick.onDidAccept(() => {
          const selectedItem = quickPick.selectedItems[0];
          if (selectedItem) {
            treeDataProvider.edit(element, selectedItem.label);
          }
          quickPick.hide();
        });

        quickPick.show();
      } else {
        const input = await vscode.window.showInputBox({
          value: element.value.value,
          prompt: `Update the value for ${element.key}`,
        });

        if (!input) {
          return;
        }

        treeDataProvider.edit(element, input);
      }
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
