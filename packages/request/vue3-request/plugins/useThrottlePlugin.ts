// @ts-ignore
import { throttle } from "../utils/xe-utils/throttle";
import { toValue, watchEffect, onWatcherCleanup } from "vue";
import { warn } from "../utils";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin(
  (requestInstance, { throttleWait, throttleOptions }) => {
    let throttledRun:
      | (ReturnType<typeof throttle> & { cancel: () => void })
      | null = null;
    const originRunRef: typeof requestInstance.runAsync =
      requestInstance.runAsync;

    watchEffect(() => {
      const { is, value: throttleWaitValue } = warn(toValue(throttleWait));
      if (!is) return;
      const throttleOptionsValue = toValue(throttleOptions);
      
      throttledRun = throttle(
        (runAsync: typeof requestInstance.runAsync) => runAsync(),
        throttleWaitValue,
        throttleOptionsValue
      ) as ReturnType<typeof throttle> & { cancel: () => void };

      requestInstance.runAsync = (...params) => {
        return new Promise((resolve, reject) => {
          throttledRun(() => {
            originRunRef(...params)
              .then(resolve)
              .catch(reject);
          });
        });
      };
      onWatcherCleanup(() => {
        throttledRun?.cancel();
        requestInstance.runAsync = originRunRef;
      });
    });

    return {
      onCancel: () => {
        throttledRun?.cancel();
      },
    };
  }
);
