import { onUnmounted, ref, toValue, watchEffect } from "vue";
import { definePlugin } from "../utils/definePlugin";
import { subscribeFocus } from "../utils/subscribeFocus";
import { isNil, warn } from "../utils";

export default definePlugin(
  (
    requestInstance,
    { refocusTimespan = 5000, refreshOnWindowFocus = false }
  ) => {
    const unsubscribes = ref();

    const { is } = warn(toValue(refocusTimespan));
    if (
      !is ||
      isNil(toValue(refreshOnWindowFocus)) ||
      typeof toValue(refreshOnWindowFocus) !== "boolean"
    )
      return {};

    const limitFun = (fn: () => void, timespan: number) => {
      let flag: boolean = false;
      return () => {
        if (flag) return;
        flag = true;
        fn();
        setTimeout(() => {
          flag = false;
        }, timespan);
      };
    };

    watchEffect(() => {
      unsubscribes.value?.();

      if (toValue(refreshOnWindowFocus)) {
        unsubscribes.value = subscribeFocus(
          limitFun(requestInstance.refresh, toValue(refocusTimespan))
        );
      }
    });
    onUnmounted(() => {
      unsubscribes.value?.();
    });
    return {};
  }
);
