import type { Plugin } from "../types";
export const definePlugin = <D = any, P extends any[] = any>(
  plugin: Plugin<D, P>
) => plugin;
