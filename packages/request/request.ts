import type { CallbackType, IOptions, IState, } from './types'
import { reactive, onScopeDispose } from 'vue'
import { isAbortError } from './utils'

export class Request<D, P extends any[]> {
    currentRequestId: number = 0

    controller: AbortController | null = null
    // pluginImpls: any[] = []

    state: IState<D, P>

    constructor(public service: CallbackType<D>, public options?: IOptions<D, P>) {
        console.log('options', options)
        this.state = reactive({
            data: undefined,
            isLoading: false,
            isFinished: false,
            isAborted: false,
            error: undefined,
            params: options?.defaultParams || []
        }) as IState<D, P>
    }
    setState(s: Partial<IState<D, P>>) {
        Object.assign(this.state, s)
    }
    initsignal = () => {
        this.controller = new AbortController()
        this.setState(
            {
                isAborted: this.controller.signal.aborted
            }
        )
        const signal = this.controller.signal
        return {
            signal,
        }
    }
    // 中止请求
    abort = () => {
        if (this.controller && !this.controller.signal.aborted && !this.state.isFinished) {
            this.controller.abort()
            this.setState({ isAborted: this.controller.signal.aborted })
        }
    }
    // 设置加载状态
    loading = (isLoading: boolean) => {
        this.setState({ isLoading, isFinished: !isLoading })
    }

    // 请求完成
    onFinished = () => {
        this.loading(isAbortError(this.state.error) && !this.state.isAborted || false)
        this.options?.onFinally?.(this.state.params, this.state.data, this.state.error)
    }

    runAsync = async (...params: P): Promise<D> => {
        const requestId = ++this.currentRequestId

        if (params.length) {
            this.setState({ params })
        }

        this.loading(true)

        const { signal } = this.initsignal()

        try {
            this.options.onBefore?.(this.state.params)

            const res = await this.service(signal)(...this.state.params)
            console.log('requestId', requestId, this.currentRequestId)

            if (requestId !== this.currentRequestId) {
                return new Promise(() => { })
            }

            this.setState({ data: res })

            this.options?.onSuccess?.(res, this.state.params)

            this.onFinished()

            return res
        } catch (error) {
            // 检查请求ID是否已递增（竞态取消）
            if (requestId !== this.currentRequestId) {
                return new Promise(() => { })
            }

            const err = error as Error

            this.setState({ error: isAbortError(err) && !this.state.isAborted ? undefined : err })

            this.options?.onError?.(err, this.state.params)

            this.onFinished()

            throw err // 抛出错误
        }
    }

    run = (...args: P) => {
        console.log('run', args)
        this.runAsync(...args).catch(error => {
            if (!this.options?.onError) {
                console.error(error);
            }
        })
    }

    reset = () => {
        this.setState({ params: [] as P, data: undefined, error: undefined, isLoading: false, isFinished: false, isAborted: false })
    }

    stop = () => {
        // 清理对象引用
        this.controller = null
        this.currentRequestId = 0
    }

    // onScopeDispose() {
    //     this.stop()

    // }
}