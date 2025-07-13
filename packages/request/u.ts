import type { IOptions, CallbackType, DataType, ParamsType } from './types'
import { useAsyncHandlerImpl } from './useAsyncHandlerImpl'

export function useAsyncHandler<T extends CallbackType>(
    service: T,
    options?: IOptions<DataType<T>, ParamsType<T>>,
) {
    return useAsyncHandlerImpl<DataType<T>, ParamsType<T>>(service, options)
}








