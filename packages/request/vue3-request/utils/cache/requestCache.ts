import type { ServiceType } from "../../types";

const requestCache = new Map<string, ReturnType<ServiceType>>();

export const setRequestCache = <D, P extends any[]>(
  cacheKey: string,
  service: ReturnType<ServiceType<D, P>>
) => {
  requestCache.set(cacheKey, service);

  service
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      clearRequestCache(cacheKey, service);
    });
};

export const getRequestCache = (cacheKey: string) => {
  return requestCache.get(cacheKey);
};

export const clearRequestCache = (cacheKey?: string, service?: Promise<any>) => {
  if (cacheKey && typeof cacheKey === "string") {
    if (service && requestCache.get(cacheKey) !== service) {
      return;
    }
    requestCache.delete(cacheKey);
    return;
  }

  requestCache.clear();
};
