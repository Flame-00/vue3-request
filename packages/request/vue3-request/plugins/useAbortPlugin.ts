import { Plugin } from "../types";

export const useAbortPlugin: Plugin = (requestInstance) => {
  let controller: AbortController | null = null;
  const { setState } = requestInstance;

  // 初始化信号
  const initSignal = () => {
    controller = new AbortController();

    setState({
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

      setState({
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
};
