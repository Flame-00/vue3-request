# 参数管理

`useAsyncHandler` 返回的 `params` 会记录当次调用 `service` 的参数数组。比如你触发了 `run(1, 2, 3)`，则 `params `等于 `[1, 2, 3]` 。

- `onBefore`：请求之前触发
- `onSuccess`：请求成功触发
- `onError`：请求失败触发
- `onFinally`：请求完成触发

四个[生命周期](./lifecycle.md)中都有`params`参数提供

## 默认请求

如果我们设置了 `options.manual = false`，则首次调用 `service` 的参数可以通过 `options.defaultParams` 来设置。

:::demo

```vue
<template>
  <input id="ipt" type="text" placeholder="输入姓氏" v-model="xing" />
  <Button type="primary" @click="() => run(xing)">生成姓名</Button>
  <section>
    <Loading v-if="isLoading" />
    <h4 v-if="params">params: {{ params }}</h4>
    <pre v-if="data">{{ data.data }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { ref } from "vue";

const xing = ref("范");

interface IName {
  data: {
    code: number;
    msg: string;
    data: string[];
  };
}

const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以

const testService = (xing: string): Promise<IName> => {
  return axiosInstance.get(
    "https://api.pearktrue.cn/api/name/generate?sex=all&count=5",
    {
      params: {
        xing,
      },
    }
  );
};

const { run, data, params, isLoading } = useAsyncHandler(() => testService, {
  defaultParams: ["林"],
});
</script>
```

:::

## 手动触发

`useAsyncHandler`使用 run 或者 runAsync 传参有两种形式，随你喜欢，想用哪种都可以， 两种传参形式都有 **TS 类型提示**

```ts
const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器

const xing = ref<string>("范");

// 异步函数
const testService = (xing: string, signal?: AbortSignal): Promise<IName> => {
  return axiosInstance.get(
    "https://api.pearktrue.cn/api/name/generate?sex=all&count=5",
    {
      params: {
        xing,
      },
      signal, // 可能会需要取消请求?
    }
  );
};

// 第一种, 通过run runAsync 传给testService (推荐)
const { run, refresh, data, params, error, isLoading } = useAsyncHandler(
  () => testService,
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);

onMounted(() => {
  run(xing.value); // 拥有 testService 相同的params类型
});

// 第二种, 写成工厂模式, (需要传signal(可选)用来取消请求的场景就必须使用这种形式)
const { run, refresh, data, params, error, isLoading } = useAsyncHandler(
  (signal) => (xing: string) => testService(xing, signal),
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);

onMounted(() => {
  run(xing.value); // 类型需要定义, 如上(xing: string)
});

// 其他情况, 不用run 或 runAsync 但是也写成工厂模式, 那就是直传testService (不推荐)
const { run, refresh, data, params, error, isLoading } = useAsyncHandler(
  () => () => testService(xing.value),
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);

onMounted(() => {
  run(); // 无参数可传
});
```
