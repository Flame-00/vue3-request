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
      { text: "指南", link: "/introduce/" },
      { text: "Demo", link: "/demo/basic/" },
      {
        text: "在线沙盒示例",
        link: "https://codesandbox.io/p/sandbox/admiring-ride-4sz9l7",
      },
      { text: "API", link: "/API/" },
    ],
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    editLink: {
      pattern: "https://github.com/fslflame/vue3-request",
      text: "在 GitHub 上编辑此页面",
    },
    externalLinkIcon: true,
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
      label: "目录",
    },
    sidebar: [
      {
        text: "指南",
        items: [
          { text: "介绍", link: "/introduce/" },
          { text: "起步", link: "/starting/" },
        ],
      },
      {
        text: "演示",
        items: [
          { text: "基本使用", link: "/demo/basic" },
          { text: "参数管理", link: "/demo/parameter-management" },
          { text: "生命周期", link: "/demo/lifecycle" },
          { text: "刷新（重复上一次请求）", link: "/demo/refresh" },
          { text: "取消响应", link: "/demo/cancel-response" },
          { text: "中止请求", link: "/demo/abort-request" },
          { text: "轮询", link: "/demo/polling" },
          { text: "Ready", link: "/demo/ready" },
          { text: "缓存 & SWR", link: "/demo/cache" },
          { text: "请求重试", link: "/demo/retry" },
          { text: "节流", link: "/demo/throttle" },
          { text: "防抖", link: "/demo/debounce" },
          { text: "屏幕聚焦重新请求", link: "/demo/focus-rerequest" },
        ],
      },
      {
        text: "插件",
        items: [
          { text: "默认插件", link: "/plugin/default-plugin" },
          { text: "自定义插件", link: "/plugin/custom-plugin" },
        ],
      },
      {
        text: "其他",
        items: [
          { text: "API", link: "/API/" },
          { text: "FAQ", link: "/FAQ/" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/fslflame/vue3-request" },
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
  },
});
