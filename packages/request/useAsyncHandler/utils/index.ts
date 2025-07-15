// 验证值
function validate(value: unknown) {
    if (value === undefined) return value
    return typeof value === 'number' && !isNaN(value)
}
// 警告
export function warn(originalValue: unknown, infinite?: boolean): { is: boolean, value: number } {
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
}  // 延迟
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}