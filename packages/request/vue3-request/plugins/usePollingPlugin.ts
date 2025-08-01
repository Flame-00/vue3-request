import { onUnmounted, ref, toValue, watch } from "vue";
import { warn } from "../utils";
import { subscribe } from "../utils/subscribeReVisible";
import { isDocumentVisible } from "../utils/isDocumentVisible";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin((
  requestInstance,
  { pollingInterval, pollingWhenHidden = ref(true), errorRetryCount }
) => {
  const unsubscribeRef = ref<(() => void) | null>(null);
  const pollingTimer = ref();

  const polling = () => {
    let timer: number | undefined;

    const { value: errorRetryCountValue } = warn(
      toValue(errorRetryCount),
      true
    );
    if (requestInstance.state.error && errorRetryCountValue !== 0) return;

    const { is: isPollingInterval, value: pollingIntervalValue } = warn(
      toValue(pollingInterval)
    );
    if (!isPollingInterval) return;
    const interval = pollingIntervalValue;

    timer = window.setTimeout(() => {
      const isHidden = !toValue(pollingWhenHidden) && !isDocumentVisible();

      if (isHidden) {
        unsubscribeRef.value = subscribe(() => {
          requestInstance.refresh();
        });
      } else {
        requestInstance.refresh();
      }
    }, interval);

    return () => {
      timer && window.clearTimeout(timer);
      unsubscribeRef.value?.();
    };
  };
  watch(
    [() => toValue(pollingInterval), () => toValue(pollingWhenHidden)],
    () => {
      pollingTimer.value?.();
      pollingTimer.value = polling();
    }
  );
  onUnmounted(() => {
    unsubscribeRef.value?.();
  });

  return {
    onBefore: () => {
      pollingTimer.value?.();
    },
    onCancel: () => {
      pollingTimer.value?.();
    },
    onFinally: () => {
      pollingTimer.value = polling();
    },
  };
});
