// @ts-ignore
import { debounce } from '../utils/xe-utils/debounce';
import { isNil } from "../utils";
import { computed, toValue, watchEffect, onWatcherCleanup } from "vue";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin((
  requestInstance,
  { debounceWait, debounceOptions, manual }
) => {
  let initialAutoRunFlag = manual;
  let debouncedRun:
    | (ReturnType<typeof debounce> & { cancel: () => void })
    | null = null;
  const debounceWaitRef = computed(() => toValue(debounceWait));
  const debounceOptionsRef = computed(() => toValue(debounceOptions));
  const originRunRef: typeof requestInstance.runAsync =
    requestInstance.runAsync;

  if (!initialAutoRunFlag) {
    initialAutoRunFlag = true;
  }
  watchEffect(() => {
    if (isNil(debounceWaitRef.value)) return;

    debouncedRun = debounce(
      (runAsync: typeof requestInstance.runAsync) => runAsync(),
      debounceWaitRef.value,
      debounceOptionsRef.value
    ) as ReturnType<typeof debounce> & { cancel: () => void };
    requestInstance.runAsync = (...params) => {
      return new Promise((resolve, reject) => {
        if (initialAutoRunFlag) {
          initialAutoRunFlag = false;
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
});
