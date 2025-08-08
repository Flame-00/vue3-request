import { ServiceType } from "../../types";

const requestCache = new Map<string, ReturnType<ServiceType>>();

export const setRequestCache = <D, P extends any[]>(
  cacheKey: string,
  service: ReturnType<ServiceType<D, P>>
) => {
  console.log(requestCache.has(cacheKey), "has");

  requestCache.set(cacheKey, service);

  console.log("注册->finally, 请求完成后删除缓存", cacheKey);
  service
    .then((res) => {
      console.log(res);
    })
    .catch(() => {})
    .finally(() => {
      console.log("完成了，删了requestCache 中的key=>", cacheKey, requestCache, requestCache.size);
      clearRequestCache(cacheKey);
      console.log(requestCache, "requestCache", requestCache.size);
    });
};

export const getRequestCache = (cacheKey: string) => {
  return requestCache.get(cacheKey);
};

export const clearRequestCache = (cacheKey?: string) => {
  cacheKey ? requestCache.delete(cacheKey) : requestCache.clear();
};
