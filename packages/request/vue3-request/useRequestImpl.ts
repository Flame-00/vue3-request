import type {
  IOptions,
  Plugin,
  UseRequestReturnType,
  ServiceType,
} from "./types";
import { onUnmounted, toRefs } from "vue";
import { Request } from "./request";
import { clearCache } from "./utils/cache";

export function useRequestImpl<D, P extends any[]>(
  service: ServiceType<D, P>,
  options: IOptions<D, P>,
  plugins: Plugin<D, P>[]
): UseRequestReturnType<D, P> {
  const requestOptions = {
    manual: false,
    abortPrevious: true, // 默认中止前一个未完成的请求
    defaultParams: [] as unknown as P,
    ...options,
  };

  const requestInstance = new Request<D, P>(service, requestOptions);

  requestInstance.pluginImpls = plugins.map((plugin) =>
    plugin(requestInstance, requestOptions)
  );
  console.log(requestInstance.pluginImpls);
  if (!requestOptions.manual) {
    requestInstance.run(...requestOptions.defaultParams);
  }

  onUnmounted(requestInstance.cancel);

  const {
    run,
    cancel,
    refresh,
    runAsync,
    refreshAsync,
    abort,
  } = requestInstance;

  return {
    ...toRefs(requestInstance.state),
    run,
    cancel,
    refresh,
    runAsync,
    abort,
    refreshAsync,
    clearCache,
  };
}
