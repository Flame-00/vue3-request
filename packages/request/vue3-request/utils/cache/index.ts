import { CacheParamsType } from "../../types";
const cache: Map<string, CacheParamsType> = new Map();

export const setCache = <D, P>(
  key: string,
  { data, params, time }: CacheParamsType<D, P>
) => {
  cache.set(key, { data, params, time });
};

export const getCache = (key: string) => {
  return cache.get(key);
};

export const clearCache = (key?: string) => {
  key ? cache.delete(key) : cache.clear();
};
