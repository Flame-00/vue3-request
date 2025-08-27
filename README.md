更多内容请查看文档 -><a href="https://badwoman0826.github.io/vue3-request/" target="_blank">文档</a>

## 核心优势

Vue3-Request 是一个专为 Vue 3 设计的异步请求处理库，它通过统一的 useRequest Hook 和强大的插件生态，彻底简化了异步操作和 API 调用的复杂性：

✨ 统一状态管理

- 🚀 所有数据都具有响应式
- 📊 自动管理 loading、data、error、signal、params 等状态
- 🔄 提供 run、runAsync、refresh、cancel、abort 等便捷方法
- 🎛️ 支持手动和自动执行模式，满足不同业务场景

🧩 强大的插件生态 内置 9 大核心插件，开箱即用：

- <img src="https://badwoman0826.github.io/vue3-request/cancel.svg" alt="取消请求" width="20" height="20" /> 请求中止
- 🔄 错误重试
- ⚡ 防抖节流
- 💾 智能缓存
- 🔁 轮询请求
- 👁️ 窗口聚焦刷新
- 📦 依赖刷新
- ⏳ 准备状态控制
- 💻 完整 TypeScript 支持
- 🔌 框架无关
- 📝 丰富的生命周期
- 🎨 可扩展架构
- 📚 完善文档

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
const { data, error, loading, signal, refresh, abort } = useRequest(getUserInfo);
</script>
```
