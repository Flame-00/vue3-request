import { getCache, setCache } from "../utils/cache";
import { emit, on } from "../utils/cache/eventEmitter";
import { ref, onUnmounted } from "vue";
import { getRequestCache, setRequestCache } from "../utils/cache/requestCache";
import { definePlugin } from "../utils/definePlugin";
import { warn } from "../utils";
import { CacheParamsType } from "../types";

export default definePlugin(
  (
    requestInstance,
    {
      cacheKey,
      cacheTime = 300000,
      staleTime = 0,
      setCache: customSetCache,
      getCache: customGetCache,
    }
  ) => {
    const unSubscribe = ref<(() => void) | null>(null);
    let currentRequest: Promise<any> | null = null;
    const { is: isStaleTime, value: staleTimeValue } = warn(staleTime, true);
    if (!isStaleTime) {
      return {};
    }

    const _setCache = (cacheKey: string, cacheData: CacheParamsType) => {
      if (customSetCache) {
        customSetCache(cacheKey, cacheData);
      } else {
        setCache(cacheKey, cacheTime, cacheData);
      }
      emit(cacheKey, cacheData);
    };

    const _getCache = (cacheKey: string) => {
      if (customGetCache) {
        return customGetCache(cacheKey);
      } else {
        return getCache(cacheKey);
      }
    };

    function recoverCache() {
      if (!cacheKey) return;
      const cacheData = _getCache(cacheKey);
      if (cacheData && Reflect.has(cacheData, "data")) {
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

    onUnmounted(() => {
      unSubscribe.value?.();
    });

    return {
      onBefore: () => {
        if (!cacheKey) return null;

        const cacheData = _getCache(cacheKey);
        if (!cacheData || !Reflect.has(cacheData, "data")) return {};
        if (
          staleTimeValue === -1 ||
          Date.now() - cacheData.time < staleTimeValue
        ) {
          return {
            loading: false,
            data: cacheData.data,
            error: undefined,
            isReturn: true,
          };
        } else {
          return {
            data: cacheData.data,
            error: undefined,
          };
        }
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

        const cacheData = {
          data,
          params,
          time: Date.now(),
        };
        unSubscribe.value?.();
        _setCache(cacheKey, cacheData);
        unSubscribe.value = on(cacheKey, (cacheData) => {
          requestInstance.setState({
            data: cacheData.data,
          });
        });
      },
    };
  }
);
