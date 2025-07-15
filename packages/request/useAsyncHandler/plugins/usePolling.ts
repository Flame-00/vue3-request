import { Plugin } from "../types";
import { toValue } from "vue";
import { warn } from "../utils";

export const usePolling: Plugin = (requestInstance, { pollingInterval }) => {
  const { refresh } = requestInstance;
  let intervalId: number | null = null;
  // 开始轮询
  const startPolling = () => {
    const { is, value } = warn(toValue(pollingInterval));
    if (!is) return;

    cancelPolling();
    intervalId = window.setInterval(refresh, value);
  };

  // 取消轮询
  const cancelPolling = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
    intervalId = null;
  };
  
  return {
    onBefore: () => {
      startPolling();
    },
    onCancel: () => {
      cancelPolling();
    },
  };
};
