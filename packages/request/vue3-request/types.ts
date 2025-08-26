import { Ref, Reactive, ToRefs, WatchSource } from "vue";
import { Request } from "./request";

// export type ExtractResultDataType<T> = T extends (
//   signal?: AbortSignal
// ) => () => Promise<infer P>
//   ? P
//   : T extends (signal?: AbortSignal) => (...args: any[]) => Promise<infer P>
//   ? P
//   : never;

// export type ExtractInnerFunctionParams<T> = T extends (
//   signal?: AbortSignal
// ) => (...args: infer P) => any
//   ? P
//   : T extends (signal?: AbortSignal) => () => any
//   ? any[]
//   : never;

export type ServiceType<D = any, P extends any[] = any> = (
  ...args: P
) => Promise<D>;

// export type CallbackType<D = any, P extends any[] = any> = (
//   signal?: AbortSignal
// ) => ServiceType<D, P>;

// 基础选项类型
export type BaseOptions<D, P extends any[]> = Partial<{
  onBefore: (params: P) => void;
  onSuccess: (data: D, params: P) => void;
  onFinally: (params: P, data?: D, error?: Error) => void;
  onError: (error: Error, params: P) => void;
  manual: boolean;
  defaultParams: P;
  refreshDeps: WatchSource | WatchSource[] | object;
  refreshDepsAction: () => void;
  pollingInterval: number | Ref<number>;
  pollingWhenHidden: boolean | Ref<boolean>;
  errorRetryCount: number | Ref<number>;
  errorRetryInterval: number | Ref<number>;
  refreshOnWindowFocus: boolean | Ref<boolean>;
  refocusTimespan: number | Ref<number>;
  cacheKey: string | ((params?: P) => string);
  cacheTime: number;
  staleTime: number;
  setCache: (cacheKey: string, cacheData: CacheParamsType) => void;
  getCache: (cacheKey: string) => CacheParamsType;
  ready: Ref<boolean> | (() => boolean);
  debounceWait: Ref<number> | number;
  debounceOptions: Reactive<DebounceOptionsType> | DebounceOptionsType;
  throttleWait: Ref<number> | number;
  throttleOptions: Reactive<ThrottleOptionsType> | ThrottleOptionsType;
  abortPrevious: boolean;
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
  data?: D;
  loading: boolean;
  isFinished: boolean;
  isAborted: boolean;
  error?: Error;
  params: P;
  signal: AbortSignal;
}

export interface UseRequestReturnType<D, P extends any[]>
  extends ToRefs<IState<D, P>> {
  run: (...args: P) => void;
  cancel: () => void;
  refresh: () => void;
  runAsync: (...args: P) => Promise<D>;
  abort: () => void;
  refreshAsync: () => Promise<D>;
  clearCache: (key?: string) => void;
  mutate: (data: D | ((data: D) => D)) => void;
}

// export type DataType<T> = ExtractResultDataType<T>;

// export type ParamsType<T> = ExtractInnerFunctionParams<T>;

export type Plugin<D = any, P extends any[] = any, O = {}> = (
  requestInstance: Request<D, P>,
  options: BaseOptions<D, P> & O
) => PluginReturn<D, P>;

export type PluginReturn<D, P extends any[]> = Partial<{
  onBefore: (params: P) => void;
  onSuccess: (data: D, params: P) => void;
  onFinally: (params: P, data: D, error: Error) => void;
  onError: (error: Error, params: P) => void;
  onCancel: () => void;
  onMutate: (data: D) => void;
  onRequest: (service: ServiceType<D, P>) => ServiceType<D, P>;
}>;

export type PluginMethodsReturn<D, P extends any[]> = Partial<{
  servicePromise: ReturnType<ServiceType<D, P>>;
  signal: AbortSignal;
  isReturn: boolean;
  isReady: boolean;
  data?: D;
}>;

export type CacheParamsType<D = any, P = any> = {
  data?: D;
  params: P;
  time: number;
} & {
  timer?: Timeout;
};

export type CacheCallbackType<D = any, P = any> = ({
  data,
  params,
  time,
}: CacheParamsType<D, P>) => void;

export type Timeout = ReturnType<typeof setTimeout>;
