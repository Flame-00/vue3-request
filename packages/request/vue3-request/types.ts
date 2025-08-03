import { Ref, Reactive, ToRefs, WatchSource } from "vue";
import { Request } from "./request";

// 从嵌套函数中正确提取返回数据类型
// export type ExtractResultDataType<T> = T extends (
//   signal?: AbortSignal
// ) => () => Promise<infer P>
//   ? P
//   : T extends (signal?: AbortSignal) => (...args: any[]) => Promise<infer P>
//   ? P
//   : never;

// 提取内部函数的参数类型
// export type ExtractInnerFunctionParams<T> = T extends (
//   signal?: AbortSignal
// ) => (...args: infer P) => any
//   ? P
//   : T extends (signal?: AbortSignal) => () => any
//   ? any[]
//   : never;

// 回调函数类型定义

export type ServiceType<D = any, P extends any[] = any> = (
  ...args: P
) => Promise<D>;

// export type CallbackType<D = any, P extends any[] = any> = (
//   signal?: AbortSignal
// ) => ServiceType<D, P>;

export type IOptions<D, P extends any[]> = Partial<{
  onBefore: (params: P) => void; // 请求前
  onSuccess: (data: D, params: P) => void; // 请求成功
  onFinally: (params: P, data: D | undefined, error: Error | undefined) => void; // 请求完成
  onError: (error: Error, params: P) => void; // 请求失败
  manual: boolean; // 是否手动调用
  defaultParams: P; // 默认参数
  refreshDeps: WatchSource | WatchSource[] | object; // 依赖刷新参数
  refreshDepsAction: () => void; // 依赖变化时执行
  pollingInterval: number | Ref<number>; // 轮询间隔
  pollingWhenHidden: boolean | Ref<boolean>; // 在页面隐藏时，是否继续轮询。如果设置为 false，在页面隐藏时会暂时停止轮询，页面重新显示时继续上次轮询。
  errorRetryCount: number | Ref<number>; // 错误重试次数
  errorRetryInterval: number | Ref<number>; // 错误重试间隔
  refreshOnWindowFocus: boolean | Ref<boolean>; // 窗口聚焦时刷新
  refocusTimespan: number | Ref<number>; // 重新聚焦时间
  cacheKey: string; // 缓存key
  cacheTime: number; // 缓存时间
  staleTime: number; // 保鲜时间
  ready: Ref<boolean> | (() => boolean); // 是否准备好
  debounceWait: Ref<number> | number; // 防抖等待时间
  debounceOptions: Reactive<DebounceOptionsType> | DebounceOptionsType;
  throttleWait: Ref<number> | number; // 节流等待时间
  throttleOptions: Reactive<ThrottleOptionsType> | ThrottleOptionsType;
  abortPrevious: boolean; // 是否中止前一个未完成的请求
}>;

type DebounceOptionsType = {
  leading?: boolean;
  trailing?: boolean;
};
type ThrottleOptionsType = {
  leading?: boolean;
  trailing?: boolean;
};

export interface IState<D, P extends any[]> {
  data: D | undefined;
  isLoading: boolean;
  isFinished: boolean;
  isAborted: boolean;
  error: Error | undefined;
  params: P;
  signal: AbortSignal | undefined;
}

// 添加 useRequest 返回类型定义
export interface UseRequestReturnType<D, P extends any[]>
  extends ToRefs<IState<D, P>> {
  run: (...args: P) => void;
  cancel: () => void;
  refresh: () => void;
  runAsync: (...args: P) => Promise<D | undefined>;
  abort: () => void;
  refreshAsync: () => Promise<D | undefined>;
  clearCache: () => void;
}

// export type DataType<T> = ExtractResultDataType<T>;

// export type ParamsType<T> = ExtractInnerFunctionParams<T>;

export type Plugin<D = any, P extends any[] = any> = (
  requestInstance: Request<D, P>,
  options: IOptions<D, P>
) => PluginReturn<D, P>;

export type PluginReturn<D, P extends any[]> = Partial<{
  onBefore: (params: P) => void; // 请求前
  onSuccess: (data: D, params: P) => void; // 请求成功
  onFinally: (params: P, data: D, error: Error) => void; // 请求完成
  onError: (error: Error, params: P) => void; // 请求失败
  onCancel: () => void; // 取消请求
  onRequest: (service: ServiceType<D, P>) => ServiceType<D, P>; // 请求
}>;

export type PluginMethodsReturn<D, P extends any[]> = Partial<{
  servicePromise?: ReturnType<ServiceType<D, P>>;
  signal?: AbortSignal;
  isStaleTime?: boolean;
  isReady?: boolean;
}>;

export type CacheParamsType<D = any, P = any> = {
  data: D;
  params: P;
  time: number;
};

export type CacheCallbackType<D = any, P = any> = ({
  data,
  params,
  time,
}: CacheParamsType<D, P>) => void;
