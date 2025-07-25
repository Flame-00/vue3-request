---
layout: home

hero:
  name: "Vue3Request"
  text: "新一代 Vue 3 异步请求处理解决方案"
  tagline: "让复杂的异步逻辑变得简单优雅，让重复的样板代码成为历史"
  actions:
    - theme: brand
      text: 快速开始
      link: /introduce/
    - theme: brand
      text: 演示
      link: /demo/basic

features:
  - icon: 🚀
    title: 响应式数据管理
    details: 所有状态都具备 Vue 3 响应式特性，自动追踪数据变化，无需手动管理状态更新
  - icon:
      src: /cancel.svg
    title: 智能请求中止
    details: 自动生成 AbortSignal 中止过期请求，避免状态污染和竞态条件问题
  - icon: 💾
    title: 缓存 & SWR
    details: 内置智能缓存机制和 SWR 策略，提升用户体验的同时减少服务器压力
  - icon: 🔄
    title: 错误重试机制
    details: 可配置的智能重试策略，自动处理网络异常
  - icon: 📠
    title: TypeScript 原生支持
    details: 完全使用 TypeScript 编写，提供完整的类型定义和智能代码提示
  - icon: 🔁
    title: 轮询
    details: 支持可控制的轮询请求，实现数据实时同步，适用于仪表板和监控场景
  - icon: 🎯
    title: 窗口聚焦刷新
    details: 用户重新聚焦页面时智能刷新数据，确保显示的始终是最新内容
  - icon: ⚡
    title: 防抖 & 节流
    details: 内置防抖和节流功能，优化用户交互体验，减少不必要的请求调用
  - icon: 🧩
    title: 插件化架构
    details: 强大的插件生态，支持自定义插件，可扩展满足各种复杂业务场景
  - icon: 🍃
    title: 轻量高效
    details: 核心代码精简，按需加载，不会给你的项目增加不必要的负担
  - icon: 🔌
    title: 框架无关
    details: 完美兼容 Axios、Fetch 等任意请求库，无缝集成到现有项目中
  - icon: 📦
    title: 开箱即用
    details: 零配置启动，内置最佳实践，让你专注于业务逻辑而非基础设施
---

## ⚡ 快速安装

选择你喜欢的包管理器，立即开始 Vue3Request 之旅：

::: code-group

```bash [pnpm]
pnpm add vue3-request
```

```bash [npm]
npm install vue3-request
```

```bash [cnpm]
cnpm install vue3-request
```

```bash [yarn]
yarn add vue3-request
```

:::

## 🚀 5 分钟上手

```vue
<template>
  <div>
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>{{ data }}</div>
    <button @click="refresh">刷新</button>
  </div>
</template>

<script setup>
import { useRequest } from 'vue3-request'

// 定义你的 API 请求函数
const fetchUserInfo = async () => {
  const response = await fetch('/api/user')
  return response.json()
}

// 一行代码搞定状态管理
const { data, error, isLoading, refresh } = useRequest(fetchUserInfo)
</script>
```