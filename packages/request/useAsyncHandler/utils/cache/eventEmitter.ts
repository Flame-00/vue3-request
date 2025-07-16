import { CacheCallbackType } from "../../types";
import { CacheParamsType } from "../../types";

const events = new Map<string, Set<CacheCallbackType>>();

const emit = <D, P>(
  key: string,
  { data, params, time }: CacheParamsType<D, P>
) => {
  if (events.has(key)) {
    const callbacks = events.get(key);
    callbacks?.forEach((callback) => callback({ data, params, time }));
  }
};

const on = <D, P>(key: string, callback: CacheCallbackType<D, P>) => {
  if (!events.has(key)) {
    events.set(key, new Set());
  } else {
    events.get(key)?.add(callback);
  }
  // 返回取消订阅函数
  return () => {
    const callbacks = events.get(key);
    callbacks?.delete(callback);
    if (callbacks?.size === 0) {
      events.delete(key);
    }
  };
};

export { emit, on };
