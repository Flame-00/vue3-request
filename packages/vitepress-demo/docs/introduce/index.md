# Vue3AsyncHandler

:::warning 版本须知
Vue 版本>=3.0
:::

[在线沙盒示例](https://codesandbox.io/p/sandbox/admiring-ride-4sz9l7)

## 背景

在以往的业务项目中，我们经常会被 loading 状态的管理、接口数据的数据获取、错误捕获、缓存、请求重试、轮询等重复的功能实现所困扰。每次开启一个新项目都需要重新实现一遍，这是一项重复的工作，还需要确保团队的一致性。

Vue3AsyncHandler 的目的是为开发人员提供一种方便、快速的方式来管理 API 状态。通过简单的配置，可以省去那些繁琐的任务，专注于业务核心的开发。

## 特性

- 🚀 所有数据都具有响应式
- <img src="/cancel.svg" alt="取消请求" width="20" height="20" style="display: inline; vertical-align: middle;" /> 自动管理生成 signal 中止 requset
- 🔄 轮询请求
- 🤖 自动处理错误重试
- 🗄 内置请求缓存
- 🎯 聚焦页面时自动重新请求
- 📠 完全使用 Typescript 编写，具有强大的类型提示
- 🍃 轻量化
- 📦 开箱即用

## 致谢

感谢他们为我们提供了灵感

- https://attojs.com/
- https://xxapi.cn/
- https://api.pearktrue.cn
