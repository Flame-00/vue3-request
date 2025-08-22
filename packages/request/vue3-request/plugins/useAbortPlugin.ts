import { definePlugin } from "../utils/definePlugin";

export default definePlugin((requestInstance, { abortPrevious = true }) => {
  let controller: AbortController | null = null;
  // 生成新的信号，并设置到state中
  const initNewSignal = () => {
    controller = new AbortController();

    requestInstance.setState({
      signal: controller.signal,
      isAborted: controller.signal.aborted,
    });
  };

  // 中止请求
  requestInstance.abort = () => {
    if (
      controller &&
      !controller.signal.aborted &&
      !requestInstance.state.isFinished
    ) {
      controller.abort();

      requestInstance.setState({
        isAborted: controller.signal.aborted,
      });
    }
  };

  return {
    onBefore: () => {
      if (typeof abortPrevious === "boolean" && abortPrevious) {
        requestInstance.abort();
      }
      initNewSignal();
    },
    onRequest: (service) => {
      return service;
    },
    onCancel: () => {
      requestInstance.abort();
      controller = null;
    },
  };
});
