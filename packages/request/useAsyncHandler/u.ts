import type {
  IOptions,
  CallbackType,
  DataType,
  ParamsType,
  Plugin,
} from "./types";
import { useAsyncHandlerImpl } from "./useAsyncHandlerImpl";
import defaultPlugins from "./plugins";

export function useAsyncHandler<T extends CallbackType>(
  service: T,
  options?: IOptions<DataType<T>, ParamsType<T>>,
  plugins?: Plugin<DataType<T>, ParamsType<T>>[]
) {
  return useAsyncHandlerImpl<DataType<T>, ParamsType<T>>(service, options, [
    ...defaultPlugins,
    ...(plugins || []),
  ]);
}
