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
    const _getCacheKey =
      typeof cacheKey === "function" ? cacheKey : () => cacheKey;

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
      const cacheKey = _getCacheKey();
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
      onBefore: (params) => {
        const cacheKey = _getCacheKey(params);
        if (!cacheKey) return null;

        const cacheData = _getCache(cacheKey);
        if (!cacheData || !Reflect.has(cacheData, "data")) return {};
        if (
          staleTimeValue === -1 ||
          Date.now() - cacheData.time < staleTimeValue
        ) {
          return {
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
        const cacheKey = _getCacheKey(requestInstance.state.params);
        if (!cacheKey) return service;
        let servicePromise = getRequestCache(cacheKey);
        if (servicePromise && servicePromise !== currentRequest) {
          return () => servicePromise!;
        }
        servicePromise = service(); // 新的promise执行,后续会添加.then方法去等待他的返回值
        currentRequest = servicePromise;
        setRequestCache(cacheKey, servicePromise);
        return () => servicePromise;
      },
      onSuccess: (data, params) => {
        const cacheKey = _getCacheKey(params);
        if (!cacheKey) return;
        unSubscribe.value?.();

        _setCache(cacheKey, {
          data,
          params,
          time: Date.now(),
        });
        unSubscribe.value = on(cacheKey, (cacheData) => {
          requestInstance.setState({
            data: cacheData.data,
          });
        });
      },
      onMutate(data) {
        const cacheKey = _getCacheKey(requestInstance.state.params);
        if (!cacheKey) return;
        unSubscribe.value?.();

        _setCache(cacheKey, {
          data,
          params: requestInstance.state.params,
          time: Date.now(),
        });
        unSubscribe.value = on(cacheKey, (cacheData) => {
          requestInstance.setState({
            data: cacheData.data,
          });
        });
      },
    };
  }
);
