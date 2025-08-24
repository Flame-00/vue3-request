# 默认插件

Vue3Request 内置了一套强大的插件系统，提供了丰富的默认插件来满足常见的异步数据管理需求。这些插件开箱即用，无需额外配置即可享受完整的功能。

## 插件列表

Vue3Request 默认启用以下插件

| 插件名称                          | 演示                                     |
| --------------------------------- | -------------------------------------------- |
| **useErrorRetryPlugin**           | [错误重试](../demo/retry.md)                 |
| **usePollingPlugin**              | [轮询](../demo/polling.md)                   |
| **useRefreshDepsPlugin**          | [刷新（重复上一次请求）](../demo/refresh.md)                   |
| **useRefreshOnWindowFocusPlugin** | [屏幕聚焦重新请求](../demo/focus-refresh.md) |
| **useAbortPlugin**                | [中止请求](../demo/abort-request.md)         |
| **useReadyPlugin**                | [Ready](../demo/ready.md)                 |
| **useDebouncePlugin**             | [防抖](../demo/debounce.md)                  |
| **useThrottlePlugin**             | [节流](../demo/throttle.md)                  |
| **useCachePlugin**                | [缓存 & SWR](../demo/cache.md)                     |

默认插件系统让 Vue3Request 能够应对各种复杂的业务场景，同时保持 API 的简洁性和易用性。如果默认插件无法满足需求，你还可以开发[自定义插件](./custom-plugin.md)来扩展功能。
