import type {
  IOptions,
  CallbackType,
  // DataType,
  // ParamsType,
  Plugin,
  UseRequestReturnType,
} from "./types";
import { useRequestImpl } from "./useRequestImpl";
import defaultPlugins from "./plugins";

export function useRequest<D, P extends any[]>(
  service: CallbackType<D, P>,
  options?: IOptions<D, P>,
  plugins?: Plugin<D, P>[]
): UseRequestReturnType<D, P> {
  return useRequestImpl<D, P>(service, options, [
    ...(plugins || []),
    ...defaultPlugins,
  ]);
}
