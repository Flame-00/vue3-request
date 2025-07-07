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
const { data, error, loading } = useAsyncHandler(testService);
```

::: info
打开控制台, 查看组件初始化后自动执行的 testService 函数
:::

:::demo

```vue
<template>
  <hr />
  <section>
    <h3>模拟请求</h3>
    <Loading v-if="isLoading" />
    <pre v-else>{{ data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
  <hr />
  <section>
    <h3>axios</h3>
    <Loading v-if="isLoadingAxios" />
    <pre>{{ dataAxios?.data }}</pre>
    <pre v-if="errorAxios">{{ errorAxios }}</pre>
  </section>
  <hr />
  <section>
    <h3>fetch</h3>
    <Loading v-if="isLoadingFetch" />
    <pre>{{ dataFetch }}</pre>
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
  run: runAxios,
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
  run: runFetch,
  data: dataFetch,
  error: errorFetch,
  isLoading: isLoadingFetch,
} = useAsyncHandler(() => testServiceFetch);
</script>
```

:::
