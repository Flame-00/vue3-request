详情请查看文档 -> [**文档**](https://fslflame.github.io/vue3-request/)

## ⚡ 快速安装

```bash [pnpm]
pnpm add vue3-request
# or
npm i vue3-request
# or
yarn add vue3-request
# or
cnpm i vue3-request
```

## 🚀 5 分钟上手

```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>{{ data }}</div>
    <button @click="refresh">刷新</button>
    <button @click="abort">中止</button>
  </div>
</template>

<script setup lang="ts">
import { useRequest } from "vue3-request";

const getUserInfo = async () => {
  const response = await fetch("/api/userInfo", {
    signal: signal.value,
  });
  return response.json();
};

// 一行代码搞定状态管理
const { data, error, loading, signal, refresh, abort } =
  useRequest(getUserInfo);
</script>
```
