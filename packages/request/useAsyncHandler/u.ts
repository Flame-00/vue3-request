import type {
  IOptions,
  CallbackType,
  // DataType,
  // ParamsType,
  Plugin,
} from "./types";
import { useAsyncHandlerImpl } from "./useAsyncHandlerImpl";
import defaultPlugins from "./plugins";

export function useAsyncHandler<D, P extends any[]>(
  service: CallbackType<D, P>,
  options?: IOptions<D, P>,
  plugins?: Plugin<D, P>[]
) {
  return useAsyncHandlerImpl<D, P>(service, options, [
    ...(plugins || []),
    ...defaultPlugins,
  ]);
}
