import type {
  BaseOptions,
  ServiceType,
  Plugin,
  UseRequestReturnType,
} from "./types";
import { useRequestImpl } from "./useRequestImpl";
import defaultPlugins from "./plugins";

export function useRequest<D, P extends any[] = any[]>(
  service: ServiceType<D, P>,
  options?: BaseOptions<D, P>
): UseRequestReturnType<D, P>;

export function useRequest<D, P extends any[] = any[], O = {}>(
  service: ServiceType<D, P>,
  options: BaseOptions<D, P> & O,
  plugins: Plugin<D, P, O>[]
): UseRequestReturnType<D, P>;

export function useRequest<D, P extends any[] = any[]>(
  service: ServiceType<D, P>,
  options?: any,
  plugins?: Plugin<D, P, any>[]
): UseRequestReturnType<D, P> {
  return useRequestImpl<D, P>(service, options || {}, [
    ...(plugins || []),
    ...defaultPlugins,
  ]);
}
