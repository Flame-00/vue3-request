---
layout: home

hero:
  name: "Vue3Request"
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

推荐使用 `pnpm` 安装极速体验 vue3-request

::: code-group

```sh [pnpm]
pnpm add vue3-request
```

```sh [npm]
npm i vue3-request
```

```sh [cnpm]
cnpm i vue3-request
```

```sh [yarn]
yarn add vue3-request
```

:::

## Vue3+TS+Axios+Vue3Request 基础 demo

```ts
const { run, data, error, isLoading } = useRequest(() => testService);
```

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
</template>
<script setup lang="ts">
import { useRequest } from "vue3-request";

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
const { data, error, isLoading } = useRequest(() => testService);
</script>
```

:::
:::demo

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
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";

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
const { run, data, error, isLoading } = useRequest(() => testService, {
  manual: true,
});
</script>
```

:::
