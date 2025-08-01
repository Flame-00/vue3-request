import { clearCache, getCache, setCache } from "../utils/cache";
import { emit, on } from "../utils/cache/eventEmitter";
import { ref, onUnmounted } from "vue";
import { getRequestCache, setRequestCache } from "../utils/cache/requestCache";
import { definePlugin } from "../utils/definePlugin";

export default definePlugin((
  requestInstance,
  { cacheKey, cacheTime = new Date(0).setMinutes(5), staleTime = 0 }
) => {
  const unSubscribe = ref<(() => void) | null>(null);
  let clearCacheTimer: number | null = null;
  let currentRequest: Promise<any> | null = null;
  // 设置缓存数据回收时间
  const setClearCacheTime = (time: number) => {
    if (!cacheKey) return;
    if (clearCacheTimer) {
      window.clearTimeout(clearCacheTimer);
      clearCacheTimer = null;
    }

    clearCacheTimer = window.setTimeout(() => {
      clearCache(cacheKey);
      clearCacheTimer = null;
    }, time);
  };

  // 恢复缓存
  function recoverCache() {
    if (!cacheKey) return;
    const cache = getCache(cacheKey); // 获取缓存
    if (cache) {
      requestInstance.setState({
        data: cache.data,
        params: cache.params,   
      });
    }
    unSubscribe.value = on(cacheKey, (cache) => {
      requestInstance.setState({
        data: cache.data,
        params: cache.params,
      });
    });
  }
  recoverCache();

  // 保鲜时间检查
  const checkStaleTime = () => {
    if (!cacheKey) return null;

    const cache = getCache(cacheKey); // 获取缓存
    if (!cache) return null;

    if (Date.now() - cache.time > staleTime) {
      // 保鲜时间过期，可以继续请求
      return null;
    }
    return true;
  };

  onUnmounted(() => {
    unSubscribe.value?.();
  })

  return {
    onBefore: () => {
      const isStaleTime = checkStaleTime();
      if (!isStaleTime) return { isStaleTime: false };

      return { isStaleTime: true }; // 返回true 表示停止请求
    },
    onRequest: <D>(service: () => Promise<D>) => {
      if (!cacheKey) return service;
      let servicePromise = getRequestCache(cacheKey);
      if (servicePromise && servicePromise !== currentRequest) {
        console.log("缓存servicePromise ->", servicePromise);
        return () => servicePromise as Promise<D>;
      }
      servicePromise = service(); // 新的promise执行,后续会添加.then方法去等待他的返回值
      currentRequest = servicePromise;
      console.log("新的servicePromise ->", servicePromise);
      setRequestCache(cacheKey, servicePromise);
      return () => servicePromise;
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
        requestInstance.setState({
          data: cache.data,
          params: cache.params,
        });
      });
      setCache(cacheKey, cache); // 设置缓存
      emit(cacheKey, cache); // 触发缓存
      setClearCacheTime(cacheTime); // 设置缓存数据回收时间
    },
  };
});
