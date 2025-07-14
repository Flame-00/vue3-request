import type { IOptions, CallbackType, Plugin } from './types'
import { onUnmounted, toRefs } from 'vue'
import { Request } from './request'
import { useAbort } from './plugins/useAbort'

export function useAsyncHandlerImpl<D, P extends any[]>(
    service: CallbackType<D>,
    options: IOptions<D, P>,
    plugins: Plugin<D, P>[]
) {
    const requestOptions = {
        manual: false,
        ...options,
    }

    const { manual } = requestOptions

    const requestInstance = new Request<D, P>(
        service,
        requestOptions
    )

    requestInstance.pluginImpls = plugins.map(p => p(requestInstance, options))

    console.log(requestInstance.pluginImpls)
    
    if (!manual) {
        requestInstance.run(...requestOptions.defaultParams)
    }

    onUnmounted(() => {
        requestInstance.cancel()
    })

    const {
        run,
        cancel,
        refresh,
        runAsync,
        refreshAsync,
    } = requestInstance

    return {
        ...toRefs(requestInstance.state),
        run,
        cancel,
        refresh,
        runAsync,
        abort: useAbort(requestInstance, requestOptions).abort,
        refreshAsync,
    }
}