import * as vscode from "vscode";
import {
  EnvironmentFileTreeItem,
  EnvironmentKeyValueTreeItem,
  EnvironmentTreeviewProvider,
} from "./EnvironmentTreeviewProvider";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new EnvironmentTreeviewProvider(context);
  vscode.window.createTreeView("environments-sidebar", {
    treeDataProvider,
  });

  vscode.window.createTreeView("environments-explorer", {
    treeDataProvider,
  });

  vscode.commands.registerCommand("environments.create", async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let workplaceFolder: string | undefined;

    if (!workspaceFolders || workspaceFolders.length == 0) {
      vscode.window.showErrorMessage("No workspace folder is open");
    } else if (workspaceFolders.length == 1) {
      workplaceFolder = workspaceFolders[0].uri.fsPath;
    } else {
      workplaceFolder = await vscode.window.showQuickPick(
        workspaceFolders.map((folder) => folder.uri.fsPath),
        {
          placeHolder: "Select a workspace folder",
        }
      );
    }

    const fileName = await vscode.window.showInputBox({
      prompt: "Enter the name of the new environment file",
      value: ".env",
    });

    if (workplaceFolder && fileName) {
      treeDataProvider.create(workplaceFolder, fileName);
    }
  });

  vscode.commands.registerCommand(
    "environments.add",
    async (element: EnvironmentFileTreeItem) => {
      const key = await vscode.window.showInputBox({
        prompt: "Enter the key for the new environment variable",
      });

      if (!key) {
        return;
      } else if (key.includes(" ")) {
        vscode.window.showErrorMessage(
          "Environment variable keys cannot contain spaces"
        );
        return;
      }

      const value = await vscode.window.showInputBox({
        prompt: `Enter the value for ${key}`,
      });

      if (!value) {
        return;
      }

      treeDataProvider.add(element, key, value);
    }
  );

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
        if (element.value.options && element.value.options.length > 0) {
          console.log("options", element.value.options);
          const quickPick = vscode.window.createQuickPick();
          quickPick.items = element.value.options.map((option) => ({
            label: option,
          }));
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
    }
  );

  vscode.commands.registerCommand(
    "environments.flip",
    async (element: EnvironmentKeyValueTreeItem) => {
      if (element.value.type === "bool") {
        treeDataProvider.flip(element);
      }
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
