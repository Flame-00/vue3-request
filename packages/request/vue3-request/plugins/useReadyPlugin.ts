import { ref, toValue, watch } from "vue";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin(
  (requestInstance, { manual, ready = ref(true), defaultParams = [] }) => {
    const unwatch = watch(
      () => toValue(ready),
      (value) => {
        if (!manual && value) {
          requestInstance.run(...defaultParams);
        }
      },
      {
        flush: "sync",
      }
    );

    return {
      onBefore: () => ({ isReady: toValue(ready) }),
      onCancel: () => {
        unwatch();
      },
    };
  }
);
