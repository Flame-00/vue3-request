import { getCache, setCache } from "../utils/cache";
import { emit, on } from "../utils/cache/eventEmitter";
import { ref, onUnmounted } from "vue";
import { getRequestCache, setRequestCache } from "../utils/cache/requestCache";
import { definePlugin } from "../utils/definePlugin";
import { CacheParamsType } from "../types";

export default definePlugin(
  (
    requestInstance,
    { cacheKey, cacheTime = new Date(0).setMinutes(5), staleTime = 0 }
  ) => {
    const unSubscribe = ref<(() => void) | null>(null);
    // let clearCacheTimer: number | null = null;
    let currentRequest: Promise<any> | null = null;
    // 设置缓存数据回收时间
    const setClearCacheTime = (cacheKey: string, cache: CacheParamsType) => {
      setCache(cacheKey, cacheTime, cache);

      emit(cacheKey, cache); // 触发缓存

      // if (!cacheKey) return;
      // if (clearCacheTimer) {
      //   window.clearTimeout(clearCacheTimer);
      //   clearCacheTimer = null;
      // }
      // clearCacheTimer = window.setTimeout(() => {
      //   clearCache(cacheKey);
      //   clearCacheTimer = null;
      // }, time);
    };

    // 恢复缓存
    function recoverCache() {
      if (!cacheKey) return;
      const cacheData = getCache(cacheKey); // 获取缓存
      if (cacheData) {
        requestInstance.setState({
          data: cacheData.data,
          params: cacheData.params,
        });
      }
      unSubscribe.value = on(cacheKey, (cacheData) => {
        requestInstance.setState({
          data: cacheData.data,
        });
      });
    }
    recoverCache();

    // 保鲜时间检查
    const checkStaleTime = () => {
      if (!cacheKey) return null;

      const cacheData = getCache(cacheKey); // 获取缓存
      if (!cacheData) return {};

      if (staleTime === -1 || Date.now() - cacheData.time <= staleTime) {
        return {
          isLoading: false,
          data: cacheData.data,
          error: undefined,
          isReturn: true,
        };
      } else {
        // 保鲜时间过期，可以继续请求
        return {
          data: cacheData.data,
          error: undefined,
        };
      }
    };

    onUnmounted(() => {
      unSubscribe.value?.();
    });

    return {
      onBefore: checkStaleTime,
      onRequest: <D>(service: () => Promise<D>) => {
        if (!cacheKey) return service;
        let servicePromise = getRequestCache(cacheKey);
        console.log("currentRequest", servicePromise, currentRequest);
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

        const cacheData = {
          data,
          params,
          time: Date.now(),
        };
        unSubscribe.value?.(); // 取消旧的订阅
        setClearCacheTime(cacheKey, cacheData); // 设置缓存数据回收时间
        unSubscribe.value = on(cacheKey, (cacheData) => {
          // 订阅新的缓存
          requestInstance.setState({
            data: cacheData.data,
          });
        });
      },
    };
  }
);
