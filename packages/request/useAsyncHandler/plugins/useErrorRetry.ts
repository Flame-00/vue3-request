import { computed, ref, toValue } from "vue";
import { Plugin } from "../types";
import { warn, delay } from "../utils";

export const useErrorRetry: Plugin = (
  requestInstance,
  { errorRetryCount = 0, errorRetryInterval }
) => {
  const needErrorCount = ref(0);
  const isErrorRetry = ref(true);
  const { refresh } = requestInstance;
  const defaultErrorRetryInterval = computed(
    () => 1000 * Math.pow(2, needErrorCount.value)
  );

  // 取消错误重试
  const cancelErrorRetry = () => {
    needErrorCount.value = 0;
    isErrorRetry.value = false;
  };

  // 重试
  const retry = async () => {
    let { is, value } = warn(toValue(errorRetryInterval));

    if (!is) {
      value = toValue(defaultErrorRetryInterval);
    }

    await delay(value);

    refresh();
  };

  // 错误重试
  const errorRetry = async () => {
    const { is, value } = warn(toValue(errorRetryCount), true);

    if (!is) return;

    needErrorCount.value++;

    if (value === -1 || needErrorCount.value <= value) await retry();
    else needErrorCount.value = 0;
  };

  return {
    onError: () => {
      isErrorRetry.value ? errorRetry() : (isErrorRetry.value = true);
    },
    onCancel: () => {
      cancelErrorRetry();
    },
  };
};
