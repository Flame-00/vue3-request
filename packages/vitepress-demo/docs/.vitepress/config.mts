import { defineConfig } from "vitepress";
import {
  demoblockPlugin,
  demoblockVitePlugin,
} from "vitepress-theme-demoblock";
import { fileURLToPath } from "node:url";
export default defineConfig({
  title: "Vue3Request",
  description:
    "A Vue3 asynchronous request processing library, designed to simplify your asynchronous operations and API calls.",
  base: "/vue3-request",
  head: [["link", { rel: "icon", href: "/vue3-request/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "演示", link: "/guide/demo/basic/" },
      { text: "API", link: "/API/" },
      {
        text: "演练场",
        link: "https://codesandbox.io/p/devbox/yrxqp8",
      },
    ],
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    editLink: {
      pattern: "https://github.com/Flame-00/vue3-request",
      text: "在 GitHub 上为此开源项目点个Star吧！",
    },
    search: {
      provider: "local",
    },
    lastUpdated: {
      text: "最后更改",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },
    outline: {
      level: "deep",
      label: "本页目录",
    },
    sidebar: {
      "/guide/": [
        {
          text: "介绍",
          link: "/guide/introduce/",
        },
        {
          text: "起步",
          link: "/guide/starting/",
        },
        {
          text: "前言",
          link: "/guide/introduction/",
        },
        {
          text: "演示",
          items: [
            { text: "基本使用", link: "/guide/demo/basic" },
            { text: "数据更改", link: "/guide/demo/mutate" },
            { text: "参数管理", link: "/guide/demo/parameter-management" },
            { text: "生命周期", link: "/guide/demo/lifecycle" },
            { text: "刷新（重复上一次请求）", link: "/guide/demo/refresh" },
            { text: "取消响应", link: "/guide/demo/cancel-response" },
            { text: "中止请求", link: "/guide/demo/abort-request" },
            { text: "轮询", link: "/guide/demo/polling" },
            { text: "Ready", link: "/guide/demo/ready" },
            { text: "缓存 & SWR", link: "/guide/demo/cache" },
            { text: "错误重试", link: "/guide/demo/retry" },
            { text: "节流", link: "/guide/demo/throttle" },
            { text: "防抖", link: "/guide/demo/debounce" },
            { text: "屏幕聚焦重新请求", link: "/guide/demo/focus-refresh" },
          ],
        },
        {
          text: "插件",
          items: [
            { text: "默认插件", link: "/guide/plugin/default-plugin" },
            { text: "自定义插件", link: "/guide/plugin/custom-plugin" },
          ],
        },
        {
          text: "FAQ",
          link: "/guide/FAQ/",
        },
      ],
      "/API/": [{ text: "API", link: "/API/" }],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Flame-00/vue3-request" },
    ],
  },
  markdown: {
    config: (md) => {
      md.use(demoblockPlugin);
    },
  },
  vite: {
    // @ts-ignore
    plugins: [demoblockVitePlugin()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../../docs", import.meta.url)),
      },
    },
    ssr: {
      noExternal: ['naive-ui']
    },
    optimizeDeps: {
      include: ['naive-ui']
    }
  },
});
