import { definePlugin } from "../utils/definePlugin";

// 模块级单例：并发 401 只会触发一次 token 刷新，其余请求等待同一个 Promise
let refreshingToken: Promise<unknown> | null = null;

/**
 * 鉴权 Token 刷新插件
 * 请求返回 401 时自动刷新 token，刷新成功后重放原请求一次；
 * 刷新失败或重放后仍 401 时触发 onUnauthorized。
 */
export default definePlugin(
  (_requestInstance, { isUnauthorized, refreshToken, onUnauthorized }) => ({
    onRequest: (service) => async (...params) => {
      try {
        return await service(...params);
      } catch (error) {
        // 不是未授权错误，或未配置刷新函数，直接抛出
        if (!refreshToken || !isUnauthorized?.(error)) {
          throw error;
        }

        // 并发去重：只有第一个请求真正发起刷新
        if (!refreshingToken) {
          refreshingToken = refreshToken()
            .catch((refreshError) => {
              // 仅由发起刷新的请求触发一次 onUnauthorized
              onUnauthorized?.(error, refreshError);
              console.log(error);
              console.log(refreshError);
              throw refreshError;
            })
            .finally(() => {
              refreshingToken = null;
            });
        }

        // 等待刷新完成；失败时错误会继续向上抛出，不会执行重放
        console.log('开始等待刷新');
        try {
          await refreshingToken;
        } catch (e) {
          console.log('eee', e);
          throw e
        }

        // 刷新成功后仅重放一次，避免无限刷新循环
        try {
          console.log('cf');
          return await service(...params);
        } catch (retryError) {
          console.log(777, retryError);
          // 重放后仍 401，说明刷新后的 token 依然无效，跳转登录
          if (isUnauthorized?.(retryError)) {
            onUnauthorized?.(retryError);
          }
          throw retryError
        }
      }
    },
  })
);
