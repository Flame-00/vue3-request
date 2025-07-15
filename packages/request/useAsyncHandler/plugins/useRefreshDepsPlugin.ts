import { watch } from "vue";
import { Plugin } from "../types";

// 监听依赖变化 并执行刷新
export const useRefreshDepsPlugin: Plugin = (
  requestInstance,
  { refreshDeps = [], refreshDepsAction }
) => {
  const { refresh } = requestInstance;

  const unwatch = watch(
    refreshDeps,
    () => {
      if (refreshDepsAction) {
        return refreshDepsAction();
      }
      refresh();
    },
    {
      deep: true,
    }
  );

  return {
    onCancel: () => {
      console.log("onCancel-useRefreshDeps");
      unwatch();
    },
  };
};
