import { onScopeDispose, watch, type Ref, type Reactive, toValue, shallowRef, type ShallowRef, version } from 'vue'
import { setCache, getCache, clearCache } from './cache'
import { on, emit } from './eventEmitter'

// 从嵌套函数中正确提取数据类型
type ExtractResultDataType<T> = T extends (signal?: AbortSignal) => () => Promise<infer P>
  ? P
  : T extends (signal?: AbortSignal) => (...args: any[]) => Promise<infer P>
  ? P
  : never;

// 提取内部函数的参数类型
type ExtractInnerFunctionParams<T> = T extends (signal?: AbortSignal) => (...args: infer P) => any
  ? P
  : T extends (signal?: AbortSignal) => () => any
  ? []
  : never;

// 回调函数类型定义
type CallbackType<T = any> = (signal?: AbortSignal) => (...args: any[]) => Promise<T>

interface IOptions<T, P> {
  onBefore: (params: P) => void // 请求前
  onSuccess: (data: T, params: P) => void // 请求成功
  onFinally: (...e: any[]) => void // 请求完成
  onError: (error: Error, params: P) => void // 请求失败
  manual: boolean // 是否手动调用
  defaultParams: P // 默认参数
  refreshDeps: (Ref<any> | Reactive<any>)[] // 依赖
  refreshDepsAction: () => void // 依赖变化时执行
  pollingInterval: number | Ref<number> // 轮询间隔
  errorRetryCount: number | Ref<number> // 错误重试次数
  errorRetryInterval: number | Ref<number> // 错误重试间隔
  refreshOnWindowFocus: boolean // 窗口聚焦时刷新
  refocusTimespan: number // 重新聚焦时间
  cacheKey: string // 缓存key
  staleTime: number // 保鲜时间
}

export function useAsyncHandler<T extends CallbackType>(
  callback: T,
  options?: Partial<IOptions<ExtractResultDataType<T>, ExtractInnerFunctionParams<T>>>
) {
  type DataType = ExtractResultDataType<T>
  type ParamsType = ExtractInnerFunctionParams<T>

  let controller: AbortController | null = null
  let intervalId: number | null = null
  let needErrorCount = 0
  let isErrorRetry = true
  let isRefocusing = true
  let promise: Promise<DataType | Error> | null = null
  let unSubscribe: (() => void) | null = null

  const data = shallowRef() as ShallowRef<DataType>
  const isLoading = shallowRef(false)
  const isFinished = shallowRef(false)
  const isAborted = shallowRef(false)
  const error = shallowRef<Error | null>(null)
  const params = shallowRef([]) as Ref<ParamsType>

  const finalOptions = {
    manual: false,
    defaultParams: [],
    errorRetryCount: 0,
    errorRetryInterval: 1000 * Math.pow(2, needErrorCount), // 错误重试间隔 指数增长
    refocusTimespan: 5000, // 重新聚焦时间
    staleTime: new Date(0).setMinutes(3), // 3分钟
    ...options
  }

  const { onBefore, onSuccess, onError, manual, defaultParams, refreshDeps, refreshDepsAction, pollingInterval, errorRetryCount, errorRetryInterval, refreshOnWindowFocus, refocusTimespan, cacheKey, staleTime } = finalOptions

  // 检查是否是取消错误
  const isAbortError = (error: any) => {
    return error?.name === 'AbortError' ||
      error?.code === 'ERR_CANCELED' ||
      error?.name === 'CanceledError'
  }
  // 中止请求
  const abort = () => {
    if (controller && !controller.signal.aborted && !isFinished.value) {
      controller.abort()
      isAborted.value = controller.signal.aborted
    }
  }

  // 设置加载状态
  function loading(isLoadingState: boolean) {
    isLoading.value = isLoadingState
    isFinished.value = !isLoadingState
  }

  // 初始化信号
  const initsignal = () => {
    controller = new AbortController()
    isAborted.value = controller.signal.aborted
    const signal = controller.signal
    return {
      signal,
    }
  }

  // 刷新
  const refresh = () => {
    run(...params.value)
  }
  // 异步刷新
  const refreshAsync = async () => {
    await runAsync(...params.value)
  }

  // 取消轮询
  const cancelPolling = () => {
    intervalId && window.clearInterval(intervalId)
  }

  // 验证值
  function validate(value: unknown) {
    if (value === undefined) return value
    return typeof value === 'number' && !isNaN(value)
  }

  // 开始轮询
  const startPolling = () => {
    const { is, value } = warn(toValue(pollingInterval))
    if (!is) return

    cancelPolling()
    intervalId = window.setInterval(refresh, value)
  }

  // 延迟
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // 重试
  const retry = async () => {
    const { is, value } = warn(toValue(errorRetryInterval))
    if (!is) return

    await delay(value)
    refresh()
  }
  // 错误重试
  const errorRetry = async () => {
    const { is, value } = warn(toValue(errorRetryCount), true)
    if (!is) return
    if (value === -1) {
      await retry()
    } else {
      needErrorCount++
      if (needErrorCount > value) {
        needErrorCount = 0
        return
      }
      await retry()
    }
  }
  // 取消错误重试
  const cancelErrorRetry = () => {
    isErrorRetry = false
  }
  // 请求完成
  const onFinally = <D>(data: D) => {
    loading(isAbortError(data) && !isAborted.value || false)
    finalOptions.onFinally?.({
      data,
      params: params.value
    })
    promise = null
  }
  // 恢复缓存
  function recoverCache() {
    if (!cacheKey) return
    const cache = getCache(cacheKey); // 获取缓存
    if (cache) {
      data.value = cache.data // 恢复数据
      params.value = cache.params // 恢复参数
    }
    unSubscribe = on<DataType, ParamsType>(cacheKey, (cache) => {
      data.value = cache.data  // 恢复数据
      params.value = cache.params // 恢复参数
    })
  }
  // 检查缓存是否过期
  const checkCache = () => {
    if (!cacheKey) return { // 没有设置缓存key
      isReturnRequest: false,
    }
    const cache = getCache(cacheKey); // 获取缓存
    if (cache) {
      if ((Date.now() - cache.time) > staleTime) { // 缓存已过期
        console.log('缓存已过期')
        clearCache(cacheKey) // 清除缓存
        return {
          isReturnRequest: false,
          cache: null
        }
      } else { // 缓存未过期
        console.log('缓存未过期')
        return {
          isReturnRequest: true,
          cache
        }
      }
    } else { // 没有缓存
      return {
        isReturnRequest: false,
        cache: null
      }
    }
  }
  recoverCache()

  // 异步执行
  const runAsync = async (...args: ParamsType): Promise<DataType | Error> => {
    const { cache, isReturnRequest } = checkCache()

    if (isReturnRequest && cache) { // 如果保鲜时间未过期并且有缓存 那么停止请求并返回缓存数据 
      const { data, params } = cache
      onBefore?.(params)

      data.value = data

      params.value = params

      onSuccess?.(data, params)

      onFinally(data)

      return data
    }

    if (promise) {
      console.log('有了', promise)
      return promise
    }

    params.value = args.length ? args : defaultParams as ParamsType
    // 中止之前的请求
    abort()

    const { signal } = initsignal() // 创建新的控制器并重置状态
    loading(true)

    startPolling() // 开始轮询

    promise = new Promise((resolve, reject) => {
      (async () => {
        try {
          onBefore?.(params.value)

          const res = await callback(signal)(...params.value)

          data.value = res

          onSuccess?.(res, params.value)

          resolve(res)

          onFinally(res)

          if (cacheKey) {
            const cache = { data: data.value, params: params.value, time: Date.now() }
            unSubscribe?.() // 取消旧的订阅
            unSubscribe = on<DataType, ParamsType>(cacheKey, (cache) => { // 订阅新的缓存
              data.value = cache.data
              params.value = cache.params
            })
            setCache(cacheKey, cache) // 设置缓存
            emit(cacheKey, cache) // 触发缓存
          }
        } catch (err) {
          const e = err as Error

          error.value = isAbortError(e) && !isAborted.value ? null : e

          onError?.(e, params.value)

          isErrorRetry ? errorRetry() : (isErrorRetry = true)

          reject(e)

          onFinally(e)
        }
      })()
    })
    return promise
  }
  // 同步执行
  const run = (...args: ParamsType) => {
    runAsync(...args).catch(error => {
      if (!onError) {
        console.error(error);
      }
    })
  }
  // 如果手动调用，则不执行
  if (!manual) {
    run(...(defaultParams as ParamsType))
  }

  // 如果refreshDeps有值，则监听refreshDeps的变化，并调用refresh
  refreshDeps && watch(refreshDeps,
    () => {
      if (refreshDepsAction) {
        return refreshDepsAction()
      }
      refresh()
    }, {
    deep: true
  })

  // 重新聚焦
  async function refocus() {
    const { is, value } = warn(refocusTimespan)
    if (!is) return
    if (window.document.visibilityState === 'visible' && navigator.onLine && isRefocusing) {
      refresh()
      isRefocusing = false
      await delay(value)
      isRefocusing = true
    }
  }

  // 监听窗口聚焦
  function listener() {
    if (refreshOnWindowFocus) {
      window.addEventListener('focus', refocus)
      window.document.addEventListener('visibilitychange', refocus)
    }
  }
  listener()

  // 警告
  function warn(originalValue: unknown, infinite?: boolean): { is: boolean, value: number } {
    if (validate(originalValue) === undefined) {
      return {
        is: false,
        value: 0
      }
    }
    if (!validate(originalValue)) {
      console.error(`${originalValue} is not a number`);
      return {
        is: false,
        value: 0
      }
    }
    if (infinite && originalValue === -1) {
      return {
        is: true,
        value: -1
      }
    }
    return {
      is: true,
      value: ((originalValue === 0 || (originalValue && originalValue as number < 0)) ? 0 : originalValue) as number
    }
  }

  // 停止
  const stop = () => {
    controller = null
    intervalId = null
    promise = null
    unSubscribe = null
    window.removeEventListener('focus', refocus)
    window.document.removeEventListener('visibilitychange', refocus)
  }

  onScopeDispose(() => {
    unSubscribe?.()
    abort()
    stop()
  }, version.startsWith('3.5') ? true : undefined)

  return {
    data,
    params,
    isLoading,
    isFinished,
    isAborted,
    error,
    abort,
    run,
    runAsync,
    refresh,
    refreshAsync,
    cancelPolling,
    cancelErrorRetry,
    clearCache
  }
}