/// <reference types="svelte" />

import * as _vscode from "vscode";

export type PostMessageTypes =
  | "onSidebarOpen"
  | "onSidebarClose"
  | "onInfo"
  | "onError";

export interface PostMessageOptions {
  type: PostMessageTypes;
  value?: any;
}

declare global {
  const tsvscode: {
    postMessage: (options: PostMessageOptions) => void;
  };
}
