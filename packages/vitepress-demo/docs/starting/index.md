# 起步

## 安装

**vue3-async-handler 是隶属于@flame00 组织下的一个包、不必关心@flame00 前缀**

### NPM

推荐使用 `pnpm` 安装极速体验 vue3-async-handler

::: code-group

```sh [pnpm]
pnpm add @flame00/vue3-async-handler
```

```sh [npm]
npm i @flame00/vue3-async-handler
```

```sh [cnpm]
cnpm i @flame00/vue3-async-handler
```

```sh [yarn]
yarn add @flame00/vue3-async-handler
```

:::

### CDN

根本不用看，现在都用Vue3+TS+Vite辣

::: code-group

```html [ES Module]
<script type="module">
  // 直接导入 ES Module 版本
  import { useAsyncHandler } from "https://unpkg.com/@flame00/vue3-async-handler@1.0.13/dist/vue3-async-handler.es.js";
  import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

  // 使用导入的模块
  const app = createApp({
    setup() {
      const { data, isLoading, run } = useAsyncHandler(() => async () => {
        const response = await fetch("/api/data");
        return response.json();
      });

      return {
        data,
        isLoading,
        fetchData: run,
      };
    },
  });

  app.mount("#app");
</script>
```

```html [浏览器全局变量方式]
<script src="https://unpkg.com/@flame00/vue3-async-handler@1.0.13/dist/vue3-async-handler.umd.js"></script>
<script>
  // 直接使用全局变量
  const { useAsyncHandler } = Vue3AsyncHandler;
</script>
```

:::
