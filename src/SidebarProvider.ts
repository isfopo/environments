import * as vscode from "vscode";
import { getNonce } from "./helpers/getNonce";
import type {
  FileData,
  PostMessageOptions,
  WorkplaceFileData,
} from "../globals";
import { parseEnvironmentContent } from "./helpers/parse";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Listen for messages from the Sidebar component and execute action
    webviewView.webview.onDidReceiveMessage(
      async (data: PostMessageOptions): Promise<void> => {
        switch (data.type) {
          case "onSidebarOpen": {
            this._handleOnSidebarOpen(webviewView);
            break;
          }
          case "onInfo": {
            if (!data.value) {
              return;
            }
            vscode.window.showInformationMessage(data.value);
            break;
          }
          case "onError": {
            if (!data.value) {
              return;
            }
            vscode.window.showErrorMessage(data.value);
            break;
          }
        }
      }
    );
  }

  public revive(panel: vscode.WebviewView): void {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "styles/reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "styles/vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return /* html */ `
    <!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>`;
  }

  private async _handleOnSidebarOpen(
    webviewView: vscode.WebviewView
  ): Promise<void> {
    const workplaceFileData: WorkplaceFileData[] = [];

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

      const fileData = files.map(
        (file, index): FileData => ({
          name: file[0],
          uri: fileUris[index].toString(),
          content: parseEnvironmentContent(fileContentStrings[index]),
        })
      );

      workplaceFileData.push({
        files: fileData,
        ...folder,
      });
    }

    webviewView.webview.postMessage({
      type: "onFiles",
      value: workplaceFileData,
    });
  }
}
