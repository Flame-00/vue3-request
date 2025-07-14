type ParamsType<D = any, P = any> = {
    data: D
    params: P
    time: number
}
type CallbackType<D = any, P = any> = ({ data, params, time }: ParamsType<D, P>) => void

const events = new Map<string, Set<CallbackType>>()

const emit = <D, P>(key: string, { data, params, time }: ParamsType<D, P>) => {
    if (events.has(key)) {
        const callbacks = events.get(key)
        callbacks?.forEach(callback => callback({ data, params, time }))
    }
}

const on = <D, P>(key: string, callback: CallbackType<D, P>) => {
    if (!events.has(key)) {
        events.set(key, new Set())
    }
    events.get(key)?.add(callback)
    // 返回取消订阅函数
    return () => {
        const callbacks = events.get(key)
        callbacks?.delete(callback)
        if (callbacks?.size === 0) {
            events.delete(key)
        }
    }
}

export {
    emit,
    on,
}