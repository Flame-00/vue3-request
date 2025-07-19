import { Plugin } from "../types";
import { warn, delay } from "../utils";
import { ref } from "vue";

export const useRefreshOnWindowFocusPlugin: Plugin = (
  requestInstance,
  { refocusTimespan = 5000, refreshOnWindowFocus }
) => {
  const { refresh } = requestInstance;
  const isRefocusing = ref(true);

  // 监听窗口聚焦
  function listener() {
    if (refreshOnWindowFocus) {
      window.addEventListener("focus", refocus);
      window.document.addEventListener("visibilitychange", refocus);
    }
  }

  listener();

  // 重新聚焦
  async function refocus() {
    const { is, value } = warn(refocusTimespan);
    if (!is) return;
    if (
      window.document.visibilityState === "visible" &&
      navigator.onLine &&
      isRefocusing.value
    ) {
      refresh();
      isRefocusing.value = false;
      await delay(value);
      isRefocusing.value = true;
    }
  }

  return {
    onCancel: () => {
      window.removeEventListener("focus", refocus);
      window.document.removeEventListener("visibilitychange", refocus);
    },
  };
};
