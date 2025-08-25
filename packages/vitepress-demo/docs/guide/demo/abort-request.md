# 中止请求

`useRequest` 返回了 `signal`参数 和 `abort`方法，用于中止尚未完成的接口请求

这样可以省去开发者自己定义 [`new AbortController()`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)和手动定义`abort`方法的繁琐

```ts
const controller = new AbortController(); // [!code --]
const signal = controller.signal; // [!code --]
const abort = () => controller.abort(); // [!code --]
axios.post(url, { signal }); // [!code --]

const { signal, abort } = useRequest(service); // [!code ++]
axios.post(url, { signal: signal.value }); // [!code ++]
```

使用的是 `xhr` 或 `fetch` 请求，并添加了`signal` 参数 **(必须)**，那么 `useRequest` 会在以下时机自动调用`abort`方法：

- 组件卸载时，还未返回结果的请求
- 前置请求中止，发起新请求时自动中止前一个未完成的请求并忽略 promise 的响应，但是如果设置了`options.abortPrevious = false` 则默认不会中止，但是依旧会[竞态取消](./cancel-response.md)

:::tip

1. 手动点击**中止请求按钮**请把**Network**网速设置为 4G 或 3G **(网速快接口返回的很快，还没来得及中止就成功了，接口慢可以忽略这条)**
2. 在**Network**中观察被中止的过期请求

:::

## 基本使用

:::demo

```vue
<template>
  <n-button type="primary" ghost @click="show = !show">{{
    show ? "Destroy child component" : "Create child component"
  }}</n-button>
  <hr />
  <ChildComponent v-if="show" />
</template>
<script setup lang="ts">
import { useRequest } from "vue3-request";
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, useMessage } from "naive-ui";
import faker from "@/utils/faker";
import axios from "axios";

const show = ref(true);

function generateComponent() {
  return {
    setup() {
      interface IResult {
        code: number;
        msg: string;
        data: string;
        request_id: string;
      }

      const message = useMessage();

      // Axios
      const axiosInstance = axios.create({
        // ...
      });
      // 响应拦截器，自己业务项目想怎么配置都可以
      axiosInstance.interceptors.response.use((response) => response.data);

      const service = (): Promise<IResult> => {
        return axiosInstance.get("https://v2.xxapi.cn/api/aiqinggongyu", {
          signal: signal.value,
        });
      };

      const { run, data, error, signal, loading, abort } = useRequest(service, {
        manual: true,
        onSuccess: (data) => {
          message.success(data.msg);
        },
        onError: (error) => {
          message.error(error.message);
        },
      });

      return () => {
        return h("div", [
          h("section", [
            h(NFlex, () => [
              h(
                NButton,
                {
                  type: "primary",
                  onClick: run,
                },
                () => "Run"
              ),
              h(
                NButton,
                {
                  type: "primary",
                  onClick: () => {
                    run();
                    run();
                    run();
                  },
                },
                () => "Run x3"
              ),
              h(
                NButton,
                {
                  type: "error",
                  onClick: abort,
                },
                () => "Abort"
              ),
            ]),
            h("hr"),
            h(
              NSpin,
              {
                show: loading.value,
              },
              () => [
                !error.value && !data.value && h(NEmpty, { size: "huge" }),
                error.value &&
                  h(
                    NText,
                    { type: "error" },
                    { default: () => error.value.message }
                  ),
                data.value &&
                  h("pre", null, JSON.stringify(data.value, null, 2)),
              ]
            ),
          ]),
        ]);
      };
    },
  };
}
const ChildComponent = generateComponent();
</script>
```

:::

## Result

| 参数   | 说明                                                                                                                          | 类型               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| signal | [`AbortController`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 的信号对象，用于传递给 `xhr` 或 `fetch` | `Ref<AbortSignal>` |
| abort  | 中止当前请求                                                                                                                  | `() => void`       |
