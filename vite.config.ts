import { defineConfig } from "vite";
import { build } from "./build";
import { plugins } from "./build/plugins";
export default defineConfig({
  plugins,
  esbuild: {
    drop: ["console", "debugger"],
  },
  build,
});
