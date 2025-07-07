# 基础用法

这一小节我们会介绍 `vue3-async-handler` 最核心，最基础的能力，也就是 `vue3-async-handler` 内核的能力。

## 默认请求

默认情况下，`useAsyncHandler` 第一个参数是一个工厂函数返回一个[异步函数](../FAQ/#什么是异步函数?)，在组件初始化时，会自动执行该工厂函数 并在其参数内部生成一个`signal(可选)`提供给开发者用来[取消请求](./cancel-request.md)。同时自动管理该工厂函数返回的异步函数的 `loading`, `data`, `error` 等状态。

[为什么要用工厂函数返回一个异步函数, 而不是直接返回异步函数?](../FAQ/#为什么要用工厂函数返回一个异步函数)

```ts
import { useAsyncHandler } from "@flame00/vue3-async-handler";

// 模拟异步请求
const testService = (): Promise<string> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        data: "我是数据",
      });
    }, 1500);
  });
};

// ✅ 工厂函数返回一个异步函数
const { data, error, loading } = useAsyncHandler(() => testService);

// ❌ 直接返回一个异步函数
const { data, error, loading } = useAsyncHandler(testService); // [!code error]
```

### `Vue3 + TS`示例代码

::: tip
打开控制台, 查看组件初始化后自动执行的 `testService` 函数
:::

:::demo

```vue
<template>
  <section>
    <h3>模拟请求</h3>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
  <hr />
  <section>
    <h3>axios</h3>
    <Loading v-if="isLoadingAxios" />
    <pre v-if="dataAxios">{{ dataAxios?.data }}</pre>
    <pre v-if="errorAxios">{{ errorAxios }}</pre>
  </section>
  <hr />
  <section>
    <h3>fetch</h3>
    <Loading v-if="isLoadingFetch" />
    <pre v-if="dataFetch">{{ dataFetch }}</pre>
    <pre v-if="errorFetch">{{ errorFetch }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@flame00/vue3-async-handler";
import axios from "axios";

// 模拟请求示例
const testService = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "数据请求成功",
        data: "我是假数据",
        request_id: "278c3c4d23e30b38a11df8ed",
      });
    }, 2500);
  });
};

const { run, data, error, isLoading } = useAsyncHandler(() => testService);

// 请求接口示例
const url1 = "https://v2.xxapi.cn/api/renjian";
const url2 = "https://v2.xxapi.cn/api/aiqinggongyu";

// axios
const configAxios = {
  method: "GET",
  url: url1,
};

const testServiceAxios = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return axios(configAxios);
};

const {
  data: dataAxios,
  error: errorAxios,
  isLoading: isLoadingAxios,
} = useAsyncHandler(() => testServiceAxios);

// fetch
const configFetch = {
  method: "GET",
};

const testServiceFetch = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  // fetch需处理返回格式
  return fetch(url2, configFetch).then((response) => response.json());
};

const {
  data: dataFetch,
  error: errorFetch,
  isLoading: isLoadingFetch,
} = useAsyncHandler(() => testServiceFetch);
</script>
```

:::

## 手动触发

如果设置了 `options.manual = true`，则 `useAsyncHandler` 不会默认执行，需要通过 `run` 或者 `runAsync` 来触发执行。

```ts
const { loading, run, runAsync } = useAsyncHandler(() => testService, {
  manual: true, // [!code ++]
});
```

::: info `run` 与 `runAsync` 的区别在于：

- `run` 是一个普通的同步函数，我们会自动捕获异常，你可以通过 `options.onError` 来处理异常时的行为。
- `runAsync` 是一个返回 Promise 的异步函数，如果使用 `runAsync` 来调用，则意味着你需要自己捕获异常。

```ts
runAsync()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

:::

接下来我们通过获取城市天气这个简单的场景，来演示 useAsyncHandler 手动触发模式，以及 `run` 与 `runAsync` 的区别。

### run

#### `Vue3 + TS`示例代码

在这个例子中，我们通过 `run(city)` 来修改用户名，通过 `onSuccess` 和 `onError `来处理成功和失败。
:::demo

```vue
<template>
  <input class="ipt" type="text" placeholder="搜索城市天气" v-model="city" />
  <Button type="primary" @click="() => search(city)">查询</Button>
  <section>
    <Loading v-if="isLoading" />
    <pre v-if="cityData">{{ cityData?.data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@flame00/vue3-async-handler";
import axios from "axios";
import { ref } from "vue";
import message from "@/utils/message";

const city = ref("");

// axios
interface ICity {
  code: number;
  msg: string;
  data: {
    city: string;
    data: {
      date: string;
      temperature: string;
      weather: string;
      wind: string;
      air_quality: string;
    }[];
  };
  request_id: string;
}

const testService = (city: string): Promise<ICity> => {
  const testUrl = `https://v2.xxapi.cn/api/weather${
    Math.random() > 0.5 ? "" : "error" // 模拟错误
  }`;
  return axios.get(testUrl, {
    params: {
      city: city || "杭州市",
    },
  });
};

const {
  run: search,
  data: cityData,
  error,
  isLoading,
  isFinished,
} = useAsyncHandler(() => testService, {
  manual: true,
  onSuccess: (data, params) => {
    console.log(data, params);
    message.success(`${data.data.msg}-----${params}`);
  },
  onError: (error, params) => {
    console.log(error, params);
    message.error(`${error}-----${params}`);
  },
});
</script>

<style></style>
```

:::

### runAsync
