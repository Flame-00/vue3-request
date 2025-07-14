export type CacheType<D = any, P = any> = {
    data: D
    params: P
    time: number
}
const cache: Map<string, CacheType> = new Map()

export const setCache = <D, P>(key: string, { data, params, time }: CacheType<D, P>) => {
    cache.set(key, { data, params, time })
}

export const getCache = (key?: string) => {
    if (key) {
        return cache.get(key)
    } else {
        cache.clear()
    }
}

export const clearCache = (key: string) => {
    cache.delete(key)
}