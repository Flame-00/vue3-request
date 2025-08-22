// @ts-ignore
import { debounce } from "../utils/xe-utils/debounce";
import { warn } from "../utils";
import { toValue, watchEffect, onWatcherCleanup, ref } from "vue";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin(
  (requestInstance, { debounceWait, debounceOptions, manual }) => {
    const initialAutoRunFlag = ref(false);
    let debouncedRun:
      | (ReturnType<typeof debounce> & { cancel: () => void })
      | null = null;
    const originRunRef: typeof requestInstance.runAsync =
      requestInstance.runAsync;
    if (!manual) {
      initialAutoRunFlag.value = true;
    }
    watchEffect(() => {
      const { is, value: debounceWaitValue } = warn(toValue(debounceWait));
      if (!is) return;
      const debounceOptionsValue = toValue(debounceOptions);

      debouncedRun = debounce(
        (runAsync: typeof requestInstance.runAsync) => runAsync(),
        debounceWaitValue,
        debounceOptionsValue
      ) as ReturnType<typeof debounce> & { cancel: () => void };
      requestInstance.runAsync = (...params) => {
        return new Promise((resolve, reject) => {
          if (initialAutoRunFlag.value) {
            initialAutoRunFlag.value = false;
            originRunRef(...params)
              .then(resolve)
              .catch(reject);
          } else {
            debouncedRun(() => {
              originRunRef(...params)
                .then(resolve)
                .catch(reject);
            });
          }
        });
      };

      onWatcherCleanup(() => {
        debouncedRun?.cancel();
        requestInstance.runAsync = originRunRef;
      });
    });
    return {
      onCancel: () => {
        debouncedRun?.cancel();
      },
    };
  }
);
