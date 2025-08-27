# 起步

## 安装

### NPM
更多内容请查看文档 -><a href="https://badwoman0826.github.io/vue3-request/" target="_blank">文档</a>
推荐使用 `pnpm` 安装极速体验 vue3-request

::: code-group

```bash [pnpm]
pnpm add vue3-request
```

```bash [npm]
npm i vue3-request
```

```bash [cnpm]
cnpm i vue3-request
```

```bash [yarn]
yarn add vue3-request
```

:::

### CDN

根本不用看，现在都用 Vue3+TS+Vite 辣

::: code-group

```html [ES Module]
<script type="module">
  // 直接导入 ES Module 版本
  import { useRequest } from "https://unpkg.com/vue3-request@1.0.24/dist/vue3-request.es.js";
  import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

  // 使用导入的模块
  const app = createApp({
    setup() {
      const { data, loading, run } = useRequest(async () => {
        const response = await fetch("/api/data");
        return response.json();
      });

      return {
        data,
        loading,
        fetchData: run,
      };
    },
  });

  app.mount("#app");
</script>
```

```html [浏览器全局变量方式]
<script src="https://unpkg.com/vue3-request@1.0.24/dist/vue3-request.umd.js"></script>
<script>
  // 直接使用全局变量
  const { useRequest } = Vue3Request;
</script>
```

:::

## 贡献者 :shamrock:

<Team />