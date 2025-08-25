import { CacheParamsType, Timeout } from "../../types";
import { warn } from "../";

const cache = new Map<string, CacheParamsType>();

export const setCache = <D, P>(
  cacheKey: string,
  cacheTime: number,
  { data, params, time }: CacheParamsType<D, P>
) => {
  let timer: Timeout | undefined;
  const cacheData = getCache(cacheKey);
  const { is, value: cacheTimeValue } = warn(cacheTime, true);
  if (!is) return;
  if (cacheData?.timer) {
    clearTimeout(cacheData.timer);
  }
  if (cacheTimeValue !== -1) {
    timer = setTimeout(() => {
      clearCache(cacheKey);
    }, cacheTimeValue);
  }

  cache.set(cacheKey, { data, params, time, timer });
};

export const getCache = (cacheKey: string) => {
  return cache.get(cacheKey);
};

export const clearCache = (cacheKey?: string) => {
  cacheKey && typeof cacheKey === "string"
    ? cache.delete(cacheKey)
    : cache.clear();
};
