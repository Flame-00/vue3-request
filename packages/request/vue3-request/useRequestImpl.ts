import type {
  BaseOptions,
  Plugin,
  UseRequestReturnType,
  ServiceType,
} from "./types";
import { onMounted, onUnmounted, toRefs } from "vue";
import { Request } from "./request";
import { clearCache } from "./utils/cache";

export function useRequestImpl<D, P extends any[] = any[], O = {}>(
  service: ServiceType<D, P>,
  options: BaseOptions<D, P> & O,
  plugins: Plugin<D, P, O>[]
): UseRequestReturnType<D, P> {
  const requestOptions = {
    manual: false,
    ...options,
  };
  const requestInstance = new Request<D, P>(service, requestOptions);

  requestInstance.pluginImpls = plugins.map((plugin) =>
    plugin(requestInstance, requestOptions)
  );
  
  onMounted(() => {
    if (!requestOptions.manual) {
      const params = requestInstance.state.params;
      requestInstance.run(...params);
    }
  });

  onUnmounted(requestInstance.cancel);

  const { run, cancel, refresh, runAsync, refreshAsync, abort, mutate } =
    requestInstance;

  return {
    ...toRefs(requestInstance.state),
    run,
    cancel,
    refresh,
    runAsync,
    mutate,
    abort,
    refreshAsync,
    clearCache,
  };
}
