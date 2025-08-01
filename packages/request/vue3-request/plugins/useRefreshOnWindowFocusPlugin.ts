import { warn } from "../utils";
import { onUnmounted, ref } from "vue";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin(
  (requestInstance, { refocusTimespan = 5000, refreshOnWindowFocus }) => {
    const { refresh } = requestInstance;
    const isRefocusing = ref(true);

    // 监听窗口聚焦
    function listener() {
      if (refreshOnWindowFocus) {
        window.addEventListener("focus", refocus);
        window.addEventListener("visibilitychange", refocus);
      }
    }

    listener();

    // 重新聚焦
    async function refocus() {
      const { is } = warn(refocusTimespan);
      if (!is) return;
      if (
        document.visibilityState === "visible" &&
        navigator.onLine &&
        isRefocusing.value
      ) {
        refresh();
        isRefocusing.value = false;
        // await delay(value);
        isRefocusing.value = true;
      }
    }
    onUnmounted(() => {});

    return {};
  }
);
