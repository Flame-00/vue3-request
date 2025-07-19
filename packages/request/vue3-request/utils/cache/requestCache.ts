import { ServiceType } from "../../types";

const requestCache = new Map<string, ReturnType<ServiceType>>();

export const setRequestCache = <D, P extends any[]>(
  key: string,
  service: ReturnType<ServiceType<D, P>>
) => {
  requestCache.set(key, service);

  console.log("注册->finally, 请求完成后删除缓存", key);
  service
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      console.log("删了requestCache finally", key);
      clearRequestCache(key);
    });
};

export const getRequestCache = (key: string) => {
  return requestCache.get(key);
};

export const clearRequestCache = (key?: string) => {
  key ? requestCache.delete(key) : requestCache.clear();
};
