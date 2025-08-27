import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
// @ts-ignore
import { useComponents } from "./useComponents";
import "./style.css";
// 通用字体
import "vfonts/Lato.css";
import Layout from "./Layout.vue";
import Team from "../../team/index.vue";
export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    useComponents(ctx.app);
    ctx.app.component("Team", Team);
  },
  // 使用注入插槽的包装组件覆盖 Layout
  Layout,
} satisfies Theme;
