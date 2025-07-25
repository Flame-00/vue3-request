import { Plugin } from "../types";
// @ts-ignore
import { throttle } from "../utils/xe-utils/throttle";
import { computed, toValue, watchEffect, onWatcherCleanup } from "vue";
import { isNil } from "../utils";

export const useThrottlePlugin: Plugin = (
  requestInstance,
  { throttleWait, throttleOptions }
) => {
  let throttledRun:
    | (ReturnType<typeof throttle> & { cancel: () => void })
    | null = null;
  const throttleWaitRef = computed(() => toValue(throttleWait));
  const throttleOptionsRef = computed(() => toValue(throttleOptions));
  const originRunRef: typeof requestInstance.runAsync =
    requestInstance.runAsync;

  watchEffect(() => {
    if (isNil(throttleWaitRef.value)) return;
    throttledRun = throttle(
      (runAsync: typeof requestInstance.runAsync) => runAsync(),
      throttleWaitRef.value,
      throttleOptionsRef.value
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
      throttledRun = null;
    },
  };
};
