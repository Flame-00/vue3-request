import type {
  BaseOptions,
  ServiceType,
  Plugin,
  UseRequestReturnType,
} from "./types";
import { useRequestImpl } from "./useRequestImpl";
import defaultPlugins from "./plugins";

// 重载1: D 是 object 且传了 resKey → K 从字面量推断
export function useRequest<
  D extends object,
  K extends keyof D,
  P extends any[] = any[]
>(
  service: ServiceType<D, P>,
  options: BaseOptions<D, P, K> & { resKey: K } // 设置resKey为必传参数
): UseRequestReturnType<D, P, K>;

// 重载2: D 是 object 但不传 resKey → K = "data"
export function useRequest<D extends object, P extends any[] = any[]>(
  service: ServiceType<D, P>,
  options?: BaseOptions<D, P, "data"> 
): UseRequestReturnType<D, P, "data">;

// 重载3: D 是基础类型 → 没有 resKey
export function useRequest<D, P extends any[] = any[]>(
  service: ServiceType<D, P>,
  options?: BaseOptions<D, P, never>
): UseRequestReturnType<D, P, never>;

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
