import { watch } from "vue";
import { isNil } from "../utils";
import { definePlugin } from "../utils/definePlugin";

// 监听依赖变化 并执行刷新
export default definePlugin(
  (requestInstance, { manual, refreshDeps, refreshDepsAction }) => {
    if (isNil(refreshDeps) || typeof refreshDeps !== "object" && typeof refreshDeps !== 'function') {
      return {};
    }
    const unwatch = watch(
      refreshDeps,
      () => {
        if (!manual) {
          if (refreshDepsAction) {
            refreshDepsAction();
          } else {
            requestInstance.refresh();
          }
        }
      },
      {
        deep: true,
      }
    );

    return {
      onCancel: () => {
        unwatch();
      },
    };
  }
);
