/// <reference types="svelte" />

import * as _vscode from "vscode";

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

declare global {
  const tsvscode: {
    postMessage: (options: PostMessageOptions) => void;
  };
}
