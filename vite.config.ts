import { defineConfig } from "vite";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import path from "path";

export default defineConfig({
  plugins: [NodeModulesPolyfillPlugin()],
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/extension.ts"),
      formats: ["cjs"],
      name: "extension",
      fileName: () => "extension.js",
    },
    rollupOptions: {
      external: ["vscode"],
      output: {
        globals: {
          vscode: "commonjs vscode",
        },
      },
    },
  },
  resolve: {
    alias: {
      // Provide any necessary aliases here
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
});
