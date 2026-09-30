import { toValue } from "vue";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin((requestInstance, { abortPrevious = true }) => {
  let controller: AbortController | null = null;

  const abortCurrent = () => {
    if (controller && !controller.signal.aborted) {
      controller.abort();
    }
  };

  const initNewSignal = () => {
    controller = new AbortController();
    requestInstance.setState({
      signal: controller.signal,
      isAborted: false,
    });
  };

  requestInstance.abort = () => {
    abortCurrent();
    requestInstance.setState({
      isAborted: true,
    });
    requestInstance.cancel();
  };

  return {
    onBefore: () => {
      if (toValue(abortPrevious)) {
        abortCurrent();
      }
      initNewSignal();
    },
    onCancel: () => {
      abortCurrent();
      if (controller) {
        requestInstance.setState({
          isAborted: controller.signal.aborted,
        });
      }
    },
  };
});
