// 检查是否是取消错误
export const isAbortError = (error: any) => {
    return error?.name === 'AbortError' ||
        error?.code === 'ERR_CANCELED' ||
        error?.name === 'CanceledError'
}