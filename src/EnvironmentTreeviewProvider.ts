import * as vscode from "vscode";
import { parseEnvironmentContent, replace } from "./helpers/parse";
import type { EnvironmentContent, EnvironmentKeyValue } from "./types";

export class EnvironmentTreeviewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  async add(element: EnvironmentFileTreeItem, key: string, value: string) {
    let content = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(element.uri)
    );

    content = content + `\n${key}=${value}`;

    vscode.workspace.fs.writeFile(
      element.uri,
      new TextEncoder().encode(content)
    );
  }

  flip(element: EnvironmentKeyValueTreeItem) {
    this.edit(element, element.value.value === "true" ? "false" : "true");
    this.refresh();
  }
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData?.fire();
  }

  async edit(element: EnvironmentKeyValueTreeItem, input: string) {
    const content = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(element.parent.uri)
    );

    vscode.workspace.fs.writeFile(
      element.parent.uri,
      new TextEncoder().encode(replace(content, element.key, input))
    );
  }

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
          new EnvironmentKeyValueTreeItem(
            key,
            content[key],
            element as EnvironmentFileTreeItem
          )
      )
    );
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

export enum EnvironmentValueType {
  string = "string",
  bool = "bool",
}

export class EnvironmentKeyValueTreeItem extends vscode.TreeItem {
  constructor(
    public readonly key: string,
    public readonly value: EnvironmentKeyValue,
    public readonly parent: EnvironmentFileTreeItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(key, collapsibleState);
    this.contextValue = `keyValue-${this.value.type}`;
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
    this.contextValue = "file";
    this.uri = uri;
    this.tooltip = this.uri.fsPath;
  }
}
