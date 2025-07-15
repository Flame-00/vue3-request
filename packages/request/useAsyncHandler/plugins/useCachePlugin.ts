import { Plugin, CacheParamsType } from "../types";
import { clearCache, getCache, setCache } from "../utils/cache";
import { emit, on } from "../utils/cache/eventEmitter";
import { ref } from "vue";

export const useCachePlugin: Plugin = (
  requestInstance,
  { cacheKey, staleTime = new Date(0).setMinutes(3), onBefore, onSuccess }
) => {
  const { setState } = requestInstance;
  const unSubscribe = ref<() => void | null>(null);

  // 恢复缓存
  function recoverCache() {
    if (!cacheKey) return;
    const cache = getCache(cacheKey); // 获取缓存
    if (cache) {
      setState({
        data: cache.data,
        params: cache.params,
      });
    }
    unSubscribe.value = on(cacheKey, (cache) => {
      setState({
        data: cache.data,
        params: cache.params,
      });
    });
  }
  recoverCache();

  // 检查缓存是否过期
  const checkCache = (): CacheParamsType | null => {
    if (!cacheKey) return null;

    const cache = getCache(cacheKey); // 获取缓存

    if (!cache) return null;

    if (Date.now() - cache.time > staleTime) {
      clearCache(cacheKey);
      return null;
    }

    // 有缓存且未过期
    return cache;
  };

  return {
    onBefore: () => {
      const cache = checkCache();

      if (!cache) {
        return {
          returnNow: false,
        };
      }

      // 如果保鲜时间未过期并且有缓存 那么停止请求
      const { data: cacheData, params: cacheParams } = cache;

      onBefore?.(cacheParams);

      setState({
        data: cacheData,
        params: cacheParams,
      });

      onSuccess?.(cacheData, cacheParams);

      requestInstance.onFinished();

      return {
        returnNow: true,
      };
    },
    onSuccess: (data, params) => {
      if (!cacheKey) return;

      const cache = {
        data,
        params,
        time: Date.now(),
      };
      unSubscribe.value?.(); // 取消旧的订阅
      unSubscribe.value = on(cacheKey, (cache) => {
        // 订阅新的缓存
        setState({
          data: cache.data,
          params: cache.params,
        });
      });
      setCache(cacheKey, cache); // 设置缓存
      emit(cacheKey, cache); // 触发缓存
    },
    onCancel: () => {
      unSubscribe.value?.();
    },
  };
};
