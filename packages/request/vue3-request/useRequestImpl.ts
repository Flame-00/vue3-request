import type { IOptions, CallbackType, Plugin, UseRequestReturnType } from "./types";
import { onUnmounted, toRefs } from "vue";
import { Request } from "./request";
import { clearCache } from "./utils/cache";

export function useRequestImpl<D, P extends any[]>(
  service: CallbackType<D, P>,
  options: IOptions<D, P>,
  plugins: Plugin<D, P>[]
): UseRequestReturnType<D, P> {
  const requestOptions = {
    manual: false,
    defaultParams: [] as P,
    ...options,
  };

  const requestInstance = new Request<D, P>(service, requestOptions);

  requestInstance.pluginImpls = plugins.map((plugin) =>
    plugin(requestInstance, requestOptions)
  );
  if (!requestOptions.manual) {
    requestInstance.run(...requestOptions.defaultParams);
  }

  onUnmounted(requestInstance.cancel);

  const { run, cancel, refresh, runAsync, refreshAsync, abort } =
    requestInstance;

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
