const requestCache = new Map<string, Promise<any>>();

export const setRequestCache = (key: string, service: Promise<any>) => {
  requestCache.set(key, service);

  service.finally(() => {
    requestCache.delete(key);
  });
};

export const getRequestCache = (key: string) => {
  return requestCache.get(key);
};

export const clearRequestCache = (key?: string) => {
  key ? requestCache.delete(key) : requestCache.clear();
};
