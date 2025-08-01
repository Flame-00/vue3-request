import { computed, ref, toValue } from "vue";
import { warn } from "../utils";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin((
  requestInstance,
  { errorRetryCount, errorRetryInterval }
) => {
  const retryTimer = ref();
  const retryCount = ref(0);
  const isErrorRetry = ref(false);
  const defaultErrorRetryInterval = computed(
    () => 1000 * Math.pow(2, retryCount.value)
  );

  // 错误重试
  const retryHandle = () => {
    let timer: number | null = null;
    retryCount.value++;

    const { value } = warn(toValue(errorRetryCount), true);
    const infiniteRetry = value === 1;
    const hasRetryCount = retryCount.value <= value;

    if (infiniteRetry || hasRetryCount) {
      let { is, value: timeout } = warn(toValue(errorRetryInterval));

      if (!is) {
        timeout = toValue(Math.min(defaultErrorRetryInterval.value, 30000));
      }

      timer = window.setTimeout(() => {
        isErrorRetry.value = true;
        requestInstance.refresh();
      }, timeout);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  };

  const clearTimer = () => {
    retryTimer.value?.();
  };

  const { is } = warn(toValue(errorRetryCount), true);

  if (!is) return {};

  return {
    onBefore: () => {
      if (!isErrorRetry.value) {
        retryCount.value = 0;
      }
      isErrorRetry.value = false;

      clearTimer();
    },
    onSuccess: () => {
      retryCount.value = 0;
    },
    onError: () => {
      retryTimer.value = retryHandle();
    },
    onCancel: () => {
      retryCount.value = 0;
      clearTimer();
    },
  };
});
