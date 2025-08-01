import { definePlugin } from "../utils/definePlugin";

export default definePlugin((requestInstance) => {
  let controller: AbortController | null = null;
  // 初始化信号
  const initSignal = () => {
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
      if (
        typeof requestInstance.options.abortPrevious === "boolean" &&
        requestInstance.options.abortPrevious
      ) {
        requestInstance.abort();
      }

      initSignal();
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
