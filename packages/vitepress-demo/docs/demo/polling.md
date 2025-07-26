# 轮询

通过设置 `options.pollingInterval` 选项，`useRequest` 会定期重新执行请求，实现数据的自动刷新功能，让你的应用保持数据同步。

## 基本用法

只需在 `useRequest` 的配置中设置 `pollingInterval` 参数（单位：毫秒），即可开启轮询功能：

```ts
const { data, isLoading } = useRequest(getUserInfo, {
  pollingInterval: 3000, // 每3秒轮询一次
});
```

- 轮询会在第一次请求完成后开始计时
- 组件卸载时会自动停止轮询

