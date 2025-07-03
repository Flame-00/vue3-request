---
layout: home

hero:
  name: "Vue3AsyncHandlerHooks"
  text: "一个Vue3的异步请求处理库，旨在简化你的异步操作和api调用"
  image:
    src: /logo.svg
    alt: Flame
  actions:
    - theme: brand
      text: 开始
      link: /markdown-examples
    - theme: alt
      text: 演示
      link: /api-examples

features:
  - icon: 🚀
    title: Reactivity
    details: 你得到的数据完全是响应式的，不用再为数据的不响应而操心
  - icon: 🛠
    title: 缓存 & SWR 
    details: 会将当前请求成功的数据缓存起来。下次组件初始化时，如果有缓存数据，我们会优先返回缓存数据，然后在背后发送新请求，也就是 SWR 的能力
  - icon: 
      src: /error.svg
    title: 错误重试
    details: 默认使用二进制指数退避算法来帮你计算出合适的间隔时间
---
