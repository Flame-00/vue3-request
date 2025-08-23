import type { Plugin } from "../types";

export const definePlugin = <D = any, P extends any[] = any, O = {}>(
  plugin: Plugin<D, P, O>
): Plugin<D, P, O> => plugin;
