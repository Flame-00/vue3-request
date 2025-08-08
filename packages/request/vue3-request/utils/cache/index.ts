import { CacheParamsType } from "../../types";

const cache = new Map<string, CacheParamsType>();

export const setCache = <D, P>(
  cacheKey: string,
  cacheTime: number,
  { data, params, time }: CacheParamsType<D, P>
) => {
  const cacheData = getCache(cacheKey);

  if (cacheData?.timer) {
    window.clearTimeout(cacheData?.timer);
  }

  const timer = window.setTimeout(() => {
    clearCache(cacheKey);
  }, cacheTime);
  cache.set(cacheKey, { data, params, time, timer });
};

export const getCache = (cacheKey: string) => {
  return cache.get(cacheKey);
};

export const clearCache = (cacheKey?: string) => {
  cacheKey ? cache.delete(cacheKey) : cache.clear();
};
