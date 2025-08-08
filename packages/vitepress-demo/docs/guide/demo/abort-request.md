# 中止请求

`useRequest` 返回了 `signal`参数 和 `abort`方法，用于中止尚未完成的接口请求

这样可以省去开发者自己定义 `new AbortController()`和手动定义`abort`方法的繁琐

```ts
const controller = new AbortController(); // [!code --]
const signal = controller.signal; // [!code --]
const abort = () => controller.abort(); // [!code --]
axios.post(url, { signal }); // [!code --]

const { signal, abort } = useRequest(testService); // [!code ++]
axios.post(url, { signal: signal.value }); // [!code ++]
```

同时 `useRequest` 会在以下时机自动调用`abort`方法：

使用的是 `xhr` 或 `fetch` 请求，并添加了`signal` 参数 **(必须)**

- 组件卸载时，还未返回结果的请求
- 前置请求中止，发起新请求时自动中止前一个未完成的请求并忽略 promise 的响应，但是如果设置了`options.abortPrevious = false` 则默认不会中止，但是依旧会[竞态取消](./cancel-response.md)

:::tip

1. 手动点击**中止请求按钮**请把**Network**网速设置为 4G 或 3G **(网速快接口返回的很快，还没来得及中止就成功了，接口慢可以忽略这条)**
2. 在**Network**中观察被中止的过期请求

:::

## `signal` and `abort()`

:::demo

```vue
<template>
  <ChildComponent v-if="show" />
  <hr />
  <n-button type="primary" ghost @click="show = !show">{{
    show ? "hidden" : "show"
  }}</n-button>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import {
  NSpin,
  NButton,
  NInput,
  NEmpty,
  NFlex,
  NText,
  useMessage,
} from "naive-ui";
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
      const lastName = ref("李");

      // Axios
      const axiosInstance = axios.create({
        // ...
      });
      // 响应拦截器，自己业务项目想怎么配置都可以
      axiosInstance.interceptors.response.use((response) => response.data);

      const testService = (): Promise<IResult> => {
        return axiosInstance.get("https://v2.xxapi.cn/api/aiqinggongyu", {
          signal: signal.value,
        });
      };

      const { run, data, error, signal, isLoading, abort } = useRequest(
        testService,
        {
          manual: true,
          onSuccess: (data, params) => {
            message.success(`params -> "${params}"`);
          },
          onError: (error, params) => {
            message.error(error.message);
          },
        }
      );

      return () => {
        return h("div", [
          h("section", [
            h(NFlex, () => [
              h(NInput, {
                type: "text",
                placeholder: "输入姓氏",
                value: lastName.value,
                "onUpdate:value": (value) => {
                  lastName.value = value;
                },
              }),
              h(
                NButton,
                {
                  type: "primary",
                  onClick: () => run(lastName.value),
                },
                () => "Add the surname"
              ),
              h(
                NButton,
                {
                  type: "primary",
                  onClick: () => {
                    run(lastName.value);
                    run(lastName.value);
                    run(lastName.value);
                  },
                },
                () => "Add the surname x3"
              ),
              h(
                NButton,
                {
                  type: "error",
                  onClick: abort,
                },
                () => "abort"
              ),
            ]),
            h("hr"),
            h(
              NSpin,
              {
                show: isLoading.value,
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
