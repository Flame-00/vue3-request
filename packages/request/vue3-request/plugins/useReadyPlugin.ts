import { ref, toValue, watch } from "vue";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin((
  requestInstance,
  { manual, ready = ref(true) }
) => {
  const unwatch = watch(
    () => toValue(ready),
    (value) => {
      if (!manual && value) {
        requestInstance.refresh();
      }
    },
    {
      flush: "sync",
    }
  );

  return {
    onBefore: () => {
      if (toValue(ready)) {
        return { isReady: true };
      }
    },
    onCancel: () => {
      unwatch();
    },
  };
});
