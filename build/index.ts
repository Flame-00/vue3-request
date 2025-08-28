import path from "path";
import { BuildOptions } from "vite";
export const build: BuildOptions = {
  lib: {
    entry: path.resolve(__dirname, "packages/request/vue3-request/index.ts"),
    name: "Vue3Request",
    formats: ["es", "cjs", "umd"],
    fileName: (format) => `vue3-request.${format}.js`,
  },
  rollupOptions: {
    external: ["vue"],
    output: {
      globals: {
        vue: "Vue",
      },
    },
  },
};
