import { Ref, Reactive } from 'vue'
import { Request } from './request'

// 从嵌套函数中正确提取返回数据类型
export type ExtractResultDataType<T> = T extends (signal?: AbortSignal) => () => Promise<infer P>
    ? P
    : T extends (signal?: AbortSignal) => (...args: any[]) => Promise<infer P>
    ? P
    : never;

// 提取内部函数的参数类型
export type ExtractInnerFunctionParams<T> = T extends (signal?: AbortSignal) => (...args: infer P) => any
    ? P
    : T extends (signal?: AbortSignal) => () => any
    ? any[]
    : never;

// 回调函数类型定义
export type CallbackType<T = any> = (signal?: AbortSignal) => (...args: any[]) => Promise<T>

export type IOptions<D, P extends any[]> = Partial<{
    onBefore: (params: P) => void // 请求前
    onSuccess: (data: D, params: P) => void // 请求成功
    onFinally: (params: P, data: D, error: Error) => void // 请求完成
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
}>

export interface IState<D, P extends any[]> {
    data: D | undefined
    isLoading: boolean
    isFinished: boolean
    isAborted: boolean
    error: Error | undefined
    params: P
}
export type DataType<T> = ExtractResultDataType<T>
export type ParamsType<T> = ExtractInnerFunctionParams<T>


export type Plugin<D = any, P extends any[] = any> = (
    requestInstance: Request<D, P>,
    options: IOptions<D, P>,
) => PluginReturn<D, P>

export type PluginReturn<D, P extends any[]> = Partial<{
    onBefore: (params: P) => void // 请求前
    onSuccess: (data: D, params: P) => void // 请求成功
    onFinally: (params: P, data: D, error: Error) => void // 请求完成
    onError: (error: Error, params: P) => void // 请求失败
    onCancel: () => void // 取消请求
    [key: string]: any
}>