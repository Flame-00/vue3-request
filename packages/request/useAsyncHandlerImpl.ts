import type { IOptions, CallbackType } from './types'
import { onMounted, onUnmounted, toRefs } from 'vue'
import { Request } from './request'

export function useAsyncHandlerImpl<D, P extends any[]>(
    service: CallbackType<D>,
    options: IOptions<D, P>,
) {

    const requestOptions = {
        manual: false,
        ...options,
    }

    const { manual, ...rest } = requestOptions

    console.log('requestOptions', requestOptions)

    const requestInstance = new Request<D, P>(
        service,
        requestOptions,
    )
    requestInstance.options = requestOptions

    onMounted(() => {
        if (!manual) {
            requestInstance.run(...requestInstance.state.params)
        }
    })

    onUnmounted(() => {
        // fetchInstance.cancel()
    })

    const {
        data,
        error,
        params,
        isLoading,
        isFinished,
        isAborted,
    } = toRefs(requestInstance.state)

    const {
        run,
        // mutate,
        // cancel,
        // refresh,
        runAsync,
        // refreshAsync,
    } = requestInstance

    return {
        data,
        error,
        params,
        isLoading,
        isFinished,
        isAborted,
        run,
        // cancel,
        // mutate,
        // refresh,
        runAsync,
        // refreshAsync,
    }
}