import { Plugin } from "../types";

export const useAbortPlugin: Plugin = (requestInstance) => {
  let controller: AbortController | null = null;
  let { setState } = requestInstance;

  // 初始化信号
  const initSignal = () => {
    controller = new AbortController();

    setState({ isAborted: controller.signal.aborted });

    const signal = controller.signal;

    return {
      signal,
    };
  };

  // 中止请求
  requestInstance.abort = () => {
    if (
      controller &&
      !controller.signal.aborted &&
      !requestInstance.state.isFinished
    ) {
      controller.abort();

      setState({ isAborted: controller.signal.aborted });
    }
  };

  return {
    onBefore: () => {
      requestInstance.abort();

      const { signal } = initSignal();
      return {
        signal,
      };
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
