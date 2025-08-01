import { ServiceType } from "../types";

export const isNil = (value: unknown) => value === undefined || value === null;

// 验证值
function validate(value: unknown) {
  if (isNil(value)) return value;
  return typeof value === "number" && !isNaN(value);
}
// 警告
export function warn(
  originalValue: unknown,
  infinite?: boolean
): { is: boolean; value: number } {
  if (validate(originalValue) === undefined) {
    return {
      is: false,
      value: 0,
    };
  }
  if (!validate(originalValue)) {
    console.error(`${originalValue} is not a number`);
    return {
      is: false,
      value: 0,
    };
  }
  if (infinite && originalValue === -1) {
    return {
      is: true,
      value: -1,
    };
  }
  return {
    is: true,
    value: (originalValue === 0 ||
    (originalValue && (originalValue as number) < 0)
      ? 0
      : originalValue) as number,
  };
}
// 洋葱模型
// 1. 从后往前执行，执行到第一个中间件时，执行service并返回结果
export const composeMiddleware = <D>(
  middlewares: ((service: ServiceType<D>) => ServiceType<D>)[],
  service: ServiceType<D>
) => {
  let next = service;
  for (let i = middlewares.length; i-- > 0; ) {
    const middleware = middlewares[i];
    next = middleware(next);
  }
  return next?.();
};

export const neverPromise = () => new Promise<any>(() => {});
