import { CacheParamsType } from "../../types";
const cache: Map<string, CacheParamsType> = new Map();

export const setCache = <D, P>(
  key: string,
  { data, params, time }: CacheParamsType<D, P>
) => {
  cache.set(key, { data, params, time });
};

export const getCache = (key?: string) => {
  if (key) {
    return cache.get(key);
  } else {
    cache.clear();
  }
};

export const clearCache = (key: string) => {
  cache.delete(key);
};
