# Vue3Request

:::warning
Vue 版本>=**3.5**
:::

[在线沙盒示例](https://codesandbox.io/p/sandbox/admiring-ride-4sz9l7)

## 背景

在现代前端开发中，异步数据管理已成为应用开发的核心挑战之一。传统的请求处理方式往往让开发者陷入状态管理的泥潭：手动管理 loading 状态、处理错误重试、实现请求缓存、控制并发请求...这些重复性工作不仅降低了开发效率，还容易引入各种 bug。
随着 Vue 3 Composition API 的广泛应用，我们需要一个更现代、更灵活的异步请求处理方案。Vue3-Request 正是为了解决这些痛点而诞生的强大工具库。

## 核心解决方案

Vue3-Request 是一个专为 Vue 3 设计的异步请求处理库，它通过统一的 useRequest Hook 和强大的插件生态，彻底简化了异步操作和 API 调用的复杂性：

✨ 统一状态管理

- 🚀 所有数据都具有响应式
- 📊 自动管理 isLoading、params、data、error、isFinished、signal 等状态
- 🔄 提供 run、runAsync、refresh、cancel、abort 等便捷方法
- 🎛️ 支持手动和自动执行模式，满足不同业务场景

🧩 强大的插件生态 内置 9 大核心插件，开箱即用：

- <img src="/cancel.svg" alt="取消请求" width="20" height="20" style="display: inline; vertical-align: middle;" /> 请求中止 - 自动生成 AbortSignal 中止过期请求，避免状态污染和竞态条件问题
- 🔄 错误重试 - 智能重试机制，提升请求成功率
- ⚡ 防抖节流 - 优化用户交互，减少无效请求
- 💾 智能缓存 - 提升用户体验，减少服务器压力
- 🔁 轮询请求 - 实时数据同步，支持动态控制
- 👁️ 窗口聚焦刷新 - 用户回到页面时自动刷新数据
- 📦 依赖刷新 - 响应式依赖变化，自动触发请求
- ⏳ 准备状态控制 - 条件请求执行，精确控制时机
- 💻 完整 TypeScript 支持 - 类型安全，智能提示
- 🔌 框架无关 - 兼容 Axios、Fetch 等任意请求库
- 📝 丰富的生命周期 - onBefore、onSuccess、onError、onFinally
- 🎨 可扩展架构 - 支持自定义插件，满足特殊需求
- 📚 完善文档 - 详尽示例，快速上手

## 为什么选择 Vue3-Request？

在一个充满挑战的异步世界中，Vue3-Request 不仅仅是一个工具库，更是你的开发伙伴。它让复杂的异步逻辑变得简单优雅，让重复的样板代码成为历史，让你可以专注于真正重要的业务逻辑。
从简单的数据获取到复杂的业务场景，从性能优化到用户体验，Vue3-Request 都为你提供了最佳实践的解决方案。让我们一起拥抱更高效、更优雅的异步编程方式！

## 致谢

感谢他们为我们提供了灵感

- https://attojs.com/
- https://ahooks.js.org/zh-CN/hooks/use-request/index
