import type {
  IOptions,
  CallbackType,
  DataType,
  ParamsType,
  Plugin,
} from "./types";
import { useAsyncHandlerImpl } from "./useAsyncHandlerImpl";
import { useRefreshDeps } from "./plugins/useRefreshDeps";
import { useAbort } from "./plugins/useAbort";
import { useErrorRetry } from "./plugins/useErrorRetry";
import { usePolling } from "./plugins/usePolling";  
import { useRefreshOnWindowFocus } from "./plugins/useRefreshOnWindowFocus";    
import { useCache } from "./plugins/useCache";          

export function useAsyncHandler<T extends CallbackType>(
  service: T,
  options?: IOptions<DataType<T>, ParamsType<T>>,
  plugins?: Plugin<DataType<T>, ParamsType<T>>[]
) {
  return useAsyncHandlerImpl<DataType<T>, ParamsType<T>>(service, options, [
    ...(plugins || []),
    useAbort,
    useRefreshDeps,
    useErrorRetry,
    usePolling,
    useRefreshOnWindowFocus,
    useCache,
  ]);
}
