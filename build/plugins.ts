import path from "path";
import dts from "vite-plugin-dts";
import { PluginOption } from "vite";
export const plugins: PluginOption[] = [
  dts({
    insertTypesEntry: true,
    include: ["packages/request/vue3-request/**/*.ts"],
    rollupTypes: true,
    outDir: path.resolve(__dirname, "dist"),
  }),
];
