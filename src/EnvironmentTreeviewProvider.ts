import * as vscode from "vscode";
import { parseEnvironmentContent } from "./helpers/parse";
import type { EnvironmentContent, EnvironmentKeyValue } from "../globals";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  onDidChangeTreeData?: vscode.Event<vscode.TreeItem> | undefined;

  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: vscode.TreeItem
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (
      !vscode.workspace.workspaceFolders ||
      vscode.workspace.workspaceFolders?.length === 0
    ) {
      vscode.window.showInformationMessage(
        "No workspace found. Open workspace to see environment."
      );
      return Promise.resolve([]);
    }

    if (!element) {
      return this.getFileData();
    }

    const { content } = element as EnvironmentFileTreeItem;

    return Promise.resolve(
      Object.keys(content).map(
        (key): EnvironmentKeyValueTreeItem =>
          new EnvironmentKeyValueTreeItem(key, content[key])
      )
    );
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: vscode.TreeItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    console.log("resolveTreeItem", item, element, token);
    return item;
  }

  private async getFileData(): Promise<EnvironmentFileTreeItem[]> {
    let fileData: EnvironmentFileTreeItem[] = [];
    for (const folder of vscode.workspace.workspaceFolders || []) {
      const files = (
        await vscode.workspace.fs.readDirectory(folder.uri)
      ).filter((file) => file[0].startsWith(".env"));

      const fileUris = files.map((file) =>
        vscode.Uri.joinPath(folder.uri, file[0])
      );

      const fileContents = await Promise.all(
        fileUris.map((uri) => vscode.workspace.fs.readFile(uri))
      );

      const fileContentStrings = fileContents.map((content) =>
        new TextDecoder().decode(content)
      );

      fileData = files.map(
        (file, index) =>
          new EnvironmentFileTreeItem(
            file[0],
            fileUris[index],
            parseEnvironmentContent(fileContentStrings[index])
          )
      );
    }

    return fileData;
  }
}

export class IEnvironmentTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}

export enum EnvironmentValueType {
  string = "string",
  bool = "bool",
}

export class EnvironmentKeyValueTreeItem extends vscode.TreeItem {
  constructor(
    public readonly key: string,
    public readonly value: EnvironmentKeyValue,
    public readonly type: EnvironmentValueType = EnvironmentValueType.string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(key, collapsibleState);
    this.tooltip = this.value.value;
    this.description = this.value.value;
  }
}

export class EnvironmentFileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    public readonly uri: vscode.Uri,
    public readonly content: EnvironmentContent,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(name, collapsibleState);
    this.uri = uri;
    this.tooltip = this.uri.fsPath;
  }
}
