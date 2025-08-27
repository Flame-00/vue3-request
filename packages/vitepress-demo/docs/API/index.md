# API Reference

Vue3Request 由 [Return Values](#return-values)、[Service](#service) 和 [Options](#options) 和 [Plugins](#plugins) 四个部分组成

```ts
const { ...ReturnValues } = useRequest(Service, Options, Plugins);
```

## Return Values

### data <Badge text="响应式" />

- **类型：** `Ref<D | undefined>`
- **默认值：** `undefined`

接口返回的数据。

### loading <Badge text="响应式" />

- **类型：** `Ref<boolean>`
- **默认值：** `false`

[Service](#service) 请求的执行状态

### params <Badge text="响应式" />

- **类型：** `Ref<P>`
- **默认值：** `[]`

[Service](#service) 的请求参数

### error <Badge text="响应式" />

- **类型：** `Ref<Error | undefined>`
- **默认值：** `undefined`

如果在内部抛出了一个错误，则会被 `error` 接收并返回

### isFinished <Badge text="响应式" />

- **类型：** `Ref<boolean>`
- **默认值：** `false`

当前请求是否已完成

### isAborted <Badge text="响应式" />

- **类型：** `Ref<boolean>`
- **默认值：** `false`

当前请求是否已中止

### signal <Badge text="响应式" />

- **类型：** `Ref<AbortSignal>`
- **默认值：** `AbortSignal`

用于中止请求的信号对象

### run

- **类型：** `(...params: P) => void`

手动触发 [Service](#service) 的请求。会自动捕获异常，通过 [`options.onError`](#onerror) 处理

### runAsync

- **类型：** `(...params: P) => Promise<R>`

与 [run](#run) 用法一致。但返回的是 `Promise`，需要自行处理异常。

### cancel

- **类型：** `() => void`

- 手动取消本次请求
- 停止[轮询](#pollinginterval)功能

::: warning 注意
这里说的取消**并不是真正的停止请求**，只是取消了对 [data](#data) 的赋值以及 [loading](#loading) 重置为 `false` 当前**已发出**的接口请求依旧会继续进行
:::

### refresh

- **类型：** `() => void`

使用上一次的 [params](#params) 重新调用 run

### refreshAsync

- **类型：** `() => Promise<R>`

使用上一次的 [params](#params) 重新调用 runAsync

### abort

- **类型：** `() => void`

中止当前请求，会触发 [AbortSignal](#signal) 信号

### mutate

- **类型：** `(data: D | ((data: D | undefined) => D)) => void`

直接修改 [data](#data) 的结果

### clearCache

- **类型：** `(cacheKey?: string) => void`

清除指定 [cacheKey](#cachekey) 对应的缓存数据或者清除全部缓存数据

## Service

- **类型：** `(...params: P) => Promise<R>`

用于发起获取资源的请求，可参考 [基本使用](../guide/demo/basic.md)。

`Service` 必须是一个[异步函数](../guide/FAQ/index.md#什么是异步函数)。你可以借助**第三方的请求库**（如 `axios` ）来帮你生成一个用于发起获取资源的请求 `Promise` 函数。

```ts
import { useRequest } from "vue3-request";
import axios from "axios";

const getUser = () => {
  return axios.get("api/user");
};

const { data } = useRequest(getUser);
```

## Options

### manual

- **类型：** `boolean`
- **默认值：** `false`

当 `manual` 设置为 `true` 时，你需要手动触发 [run](#run) 或者 [runAsync](#runasync) 才会发起请求

### defaultParams

- **类型：** `P`
- **默认值：** `[]`

如果 [manual](#manual) 设置为 `false` ，在自动执行请求的时候，将会把 `defaultParams` 作为请求参数

### onBefore

- **类型：** `(params: P) => void`

[Service](#service) 请求前触发, 参数为 [params](#params).

### onSuccess

- **类型：** `(data: D, params: P) => void`

当 [Service](#service) `resolve` 时触发，参数为 [data](#data) 和 [params](#params)

### onError

- **类型：** `(error: Error, params: P) => void`

当 [Service](#service) `reject` 时触发，参数为 [error](#error) 和 [params](#params)

### onFinally

- **类型：** `(params: P, data: D | undefined, error: Error | undefined) => void`

[Service](#service) 请求结束后触发, 参数为 [params](#params)、[data](#data) 和 [error](#error).

### refreshDeps

- **类型：** `WatchSource | WatchSource[] | object`
- **默认值：** `undefined`

当 `refreshDeps` 里面的内容发生变化时，如果没有设置 [refreshDepsAction](#refreshdepsaction), 就会触发 `refresh` 的重新执行。其本质只是对 `watch` 的封装。

```ts
watch(refreshDeps, refresh);
```

### refreshDepsAction

- **类型：** `() => void`
- **默认值：** `undefined`

当 `refreshDeps` 里面的内容发生变化时，会被调用。**`manual=true` 时才会触发**。

### pollingInterval <Badge text="响应式" />

- **类型：** `number | Ref<number>`
- **默认值：** `undefined`

通过设置轮询间隔毫秒值，可以进入轮询模式，定时触发请求。可以通过 [`run`](#run) / [`cancel`](#cancel) 来 **开启**/**停止** 轮询。在 [manual](#manual) 设置为`true` 时，需要手动执行一次 [`run`](#run) 后，才开始轮询。

- 间隔值必须 `>=0` 才会生效

### pollingWhenHidden <Badge text="响应式" />

- **类型：** `boolean | Ref<boolean>`
- **默认值：** `true`

在页面隐藏时，是否继续轮询。如果设置为 false，在页面隐藏时会暂时停止轮询，页面重新显示时继续上次轮询。

### errorRetryCount <Badge text="响应式" />

- **类型：** `number | Ref<number>`
- **默认值：** `0`

最大错误重试次数

### errorRetryInterval <Badge text="响应式" />

- **类型：** `number | Ref<number>`
- **默认值：** `undefined`

默认情况下，Vue3Request 使用**二进制指数退避算法** 来帮你计算出合适的间隔时间(不会大于 30s)，你也可以通过设置 `errorRetryInterval` 来覆盖默认行为

### refreshOnWindowFocus <Badge text="响应式" />

- **类型：** `boolean | Ref<boolean>`
- **默认值：** `false`

当设置为 `true` 时，则在浏览器窗口触发 `focus` 和 `visibilitychange` 时，会重新发起请求。

### refocusTimespan <Badge text="响应式" />

- **类型：** `number | Ref<number>`
- **默认值：** `5 * 1000`

当 [refreshOnWindowFocus](#refreshonwindowfocus) 设置为 `true` 时，你可以通过设置间隔的毫秒数，来限制 refresh 的执行间隔，默认为 5000ms

### cacheKey

- **类型：** `string | ((params?: P) => string)`
- **默认值：** `undefined`

- 我们会缓存每次请求的 data , params
- 如果设置了 `cacheKey` ， Vue3Request 会将当前请求数据缓存起来。当下次组件初始化时，如果有缓存数据，我们会优先返回缓存数据，然后在背后发送新请求，待新数据返回后，重新触发数据更新并更新缓存数据，也就是 **SWR** 的能力。
- 数据同步，任何时候，当我们改变其中某个 `cacheKey` 的内容时，其它相同 `cacheKey` 的数据也会同步改变。
- 请求 `Promise` 共享，相同的 `cacheKey` 同时只会有一个在发起请求，后发起的会共用同一个请求 `Promise`。

### cacheTime

- **类型：** `number`
- **默认值：** `10 * 30 * 1000`

当开启缓存后，你可以通过设置 `cacheTime` 来告诉我们缓存的过期时间。当缓存过期后，我们会将其删除。默认为 **300000 毫秒**，即 5 分钟

### staleTime

- **类型：** `number`
- **默认值：** `0`

如果你能确保缓存下来的数据，在一定时间内不会有任何更新的，我们建议你设置一个合理的毫秒数

- 默认为 `0`，意味着不保鲜，每次都会重新发起请求
- 设置为 `-1` 则意味着缓存永不过期

### ready <Badge text="响应式" />

- **类型：** `Ref<boolean> | () => boolean`
- **默认值：** `true`

只有当 `ready` 为 `true` 时，才会发起请求。

- 自动模式：当 `manual=false` 时，每次 `ready` 从 `false` 变为 `true` 时，都会自动发起请求，并且会带上参数 `options.defaultParams`。
- 手动模式：当 `manual=true` 时，只要 `ready` 为 `false`，则无法发起请求。

### debounceWait <Badge text="响应式" />

- **类型：** `number | Ref<number>`
- **默认值：** `undefined`

通过设置需要防抖的毫秒数，进入防抖模式。此时如果频繁触发请求，则会以防抖策略进行请求。

### debounceOptions <Badge text="响应式" />

- **类型：** `DebounceOptionsType | Reactive<DebounceOptionsType>`

```ts
type DebounceOptionsType = {
  leading?: boolean;
  trailing?: boolean;
};
```

- **默认值：**

```ts
{
  leading: false,
  trailing: true
}
```

- `leading` (boolean): 指定在延迟开始前调用。
- `trailing` (boolean): 指定在延迟结束后调用。

### throttleWait <Badge text="响应式" />

- **类型：** `number | Ref<number>`
- **默认值：** `undefined`

通过设置需要节流的毫秒数，进入节流模式。此时如果频繁触发请求，则会以节流策略进行请求。

### throttleOptions <Badge text="响应式" />

- **类型：** `ThrottleOptionsType | Reactive<ThrottleOptionsType>`

```ts
type ThrottleOptionsType = {
  leading?: boolean;
  trailing?: boolean;
};
```

- **默认值：**

```ts
{
  leading: true,
  trailing: true,
}
```

- `leading` (boolean): 指定调用在节流开始前。
- `trailing` (boolean): 指定调用在节流结束后。

### abortPrevious

- **类型：** `boolean`
- **默认值：** `true`

是否中止前一个未完成的请求

## Plugins

- **类型：** `Plugin<D, P, O>[]`

用于扩展`useRequest`的插件数组，可参考 [自定义插件](../guide/plugin/custom-plugin.md)。
