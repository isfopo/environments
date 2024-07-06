import type * as vscode from "vscode";

export type PostMessageTypes =
  | "onSidebarOpen"
  | "onSidebarClose"
  | "onInfo"
  | "onError";

export interface PostMessageOptions {
  type: PostMessageTypes;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value?: any;
}

export interface FileData {
  name: string;
  uri: string;
  content: EnvironmentContent;
}

export type EnvironmentContent = Record<string, EnvironmentKeyValue>;

export interface EnvironmentKeyValue {
  value: string;
  type: "string" | "bool" | "number";
}

export interface WorkplaceFileData extends vscode.WorkspaceFolder {
  files: FileData[];
}

declare global {
  const tsvscode: {
    postMessage: (options: PostMessageOptions) => void;
  };
}
