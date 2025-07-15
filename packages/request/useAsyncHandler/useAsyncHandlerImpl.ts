import type { IOptions, CallbackType, Plugin } from "./types";
import { onUnmounted, toRefs } from "vue";
import { Request } from "./request";
import { useAbort } from "./plugins/useAbort";
import { clearCache } from "./utils/cache";

export function useAsyncHandlerImpl<D, P extends any[]>(
  service: CallbackType<D>,
  options: IOptions<D, P>,
  plugins: Plugin<D, P>[]
) {
  const requestOptions = {
    manual: false,
    defaultParams: [] as P,
    ...options,
  };

  const requestInstance = new Request<D, P>(service, requestOptions);

  requestInstance.pluginImpls = plugins.map((plugin) =>
    plugin(requestInstance, requestOptions)
  );

  console.log("requestInstance.pluginImpls", requestInstance.pluginImpls);

  if (!requestOptions.manual) {
    requestInstance.run(...requestOptions.defaultParams);
  }

  onUnmounted(() => {
    console.log("onUnmounted");
    requestInstance.cancel();
  });

  const { run, cancel, refresh, runAsync, refreshAsync } = requestInstance;

  return {
    ...toRefs(requestInstance.state),
    run,
    cancel,
    refresh,
    runAsync,
    abort: useAbort(requestInstance, requestOptions).abort,
    refreshAsync,
    clearCache
  };
}
