---
layout: home

hero:
  name: "Vue3AsyncHandler"
  text: "一个Vue3的异步请求处理库，旨在简化你的异步操作和api调用"
  image:
    src: /logo.svg
    alt: Flame
  actions:
    - theme: brand
      text: 开始
      link: /introduce/
    - theme: brand
      text: 演示
      link: /demo/basic

features:
  - icon: 🚀
    title: 所有数据都具有响应式
  - icon:
      src: /cancel.svg
    title: 自动管理生成signal中止requset
  - icon: 🛠
    title: 缓存 & SWR
  - icon: 🤖
    title: 自动处理错误重试
  - icon: 📠
    title: 完全使用 Typescript 编写
  - icon: 🔄
    title: 轮询请求
  - icon: 🎯
    title: 聚焦页面时自动重新请求
  - icon: 🍃
    title: 轻量化
  - icon: 📦
    title: 开箱即用
---

## 安装

推荐使用 `pnpm` 安装极速体验 `Vue3AsyncHandler`

**vue3-async-handler是隶属于@flame00组织下的一个包、不必关心@flame00前缀**
::: code-group

```sh [pnpm]
pnpm add @flame00/vue3-async-handler
```

```sh [npm]
npm i @flame00/vue3-async-handler
```

```sh [cnpm]
cnpm i @flame00/vue3-async-handler
```

```sh [yarn]
yarn add @flame00/vue3-async-handler
```

:::

## `Vue3+TS+Axios+Vue3AsyncHandler` 基础 demo

[在线沙盒演示](https://codesandbox.io/p/sandbox/admiring-ride-4sz9l7)

```vue
<template>
  <section>
    <h3>模拟请求</h3>
    <Button type="primary" @click="run">手动触发</Button><br />
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
  <hr />
  <section>
    <h3>axios</h3>
    <Loading v-if="isLoadingAxios" />
    <pre v-if="dataAxios">{{ dataAxios }}</pre>
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
import message from "./utils/message";

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
    }, 1000);
  });
};
const { run, data, error, isLoading } = useAsyncHandler(() => testService, {
  manual: true,
  onSuccess(data) {
    message.success(data);
  },
});

// axios
const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以

const testServiceAxios = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return axiosInstance.get("https://v2.xxapi.cn/api/renjian");
};
const {
  data: dataAxios,
  error: errorAxios,
  isLoading: isLoadingAxios,
} = useAsyncHandler(() => testServiceAxios);

// fetch
const testServiceFetch = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  // fetch需处理返回格式
  return fetch("https://v2.xxapi.cn/api/aiqinggongyu", {
    method: "GET",
  }).then((response) => response.json());
};
const {
  data: dataFetch,
  error: errorFetch,
  isLoading: isLoadingFetch,
} = useAsyncHandler(() => testServiceFetch);
</script>
```
