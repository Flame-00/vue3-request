import { Plugin } from "../types";

let controller: AbortController | null = null;

export const useAbortPlugin: Plugin = (requestInstance) => {
  const { setState } = requestInstance;

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
  const abort = () => {
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
    abort,
    onBefore: () => {
      abort();
      
      const { signal } = initSignal();
      return {
        signal,
      };
    },
    onCancel: () => {
      abort();
      controller = null;
    },
    onFinally: (params, data, error) => {
    },
  };
};
