# 中止请求

`useRequest` 返回了 `signal` 和 `abort()`，用于中止尚未完成的接口请求

每次执行 `useRequest` 的时候,无论是自动还是手动调用, 都会在其内部自动生成一个`signal`提供给开发者, 这样可以省去开发者自己定义 `new AbortController()`的繁琐

```tsx
const controller = new AbortController(); // [!code --]
const signal = controller.signal; // [!code --]

const { signal, abort } = useRequest(testService); // [!code ++]
```

同时 `useRequest` 会在以下时机自动调用`abort`函数：

使用的是 `xhr` 或 `fetch` 请求，并添加了`signal` 参数 **(必须)**

- 组件卸载时，还未返回结果的请求
- 前置请求中止，发起新请求时自动中止前一个未完成的请求并忽略 promise 的响应

如果设置了`options.abortPrevious = false` 则不会前置请求中止，但是依旧会[竞态取消](./cancel-response.md)

:::tip

手动点击**中止请求按钮**请把浏览器选项卡的**Network**设置网速为 3G **(网速快接口返回的很快，还没来得及中止就成功了，接口慢可以忽略这条)**
:::

:::demo

```vue
<template>
  <ChildComponent v-if="show" />
  <hr />
  <Button type="info" @click="show = !show">{{
    show ? "卸载组件" : "显示组件"
  }}</Button>
</template>
<script setup lang="ts">
import Button from "../components/Button.vue"; // demo component
import message from "@/utils/message"; // demo ts
import Loading from "../components/Loading.vue"; // demo component
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import mock from "@/utils/faker"; // test Data
import axios from "axios";

const show = ref(true);

function generateComponent() {
  return {
    setup() {
      // axios
      const axiosInstance = axios.create({
        // ...
      });
      // 响应拦截器，自己业务项目想怎么配置都可以
      axiosInstance.interceptors.response.use((response) => response.data);

      const get_aiqinggongyu = (): Promise<{
        code: number;
        msg: string;
        data: number;
        request_id: string;
      }> => {
        return axiosInstance.get("https://v2.xxapi.cn/api/aiqinggongyu", {
          signal: signal.value, // 添加signal
        });
      };

      const { run, data, error, signal, isLoading, isFinished, abort } =
        useRequest(get_aiqinggongyu, {
          manual: true,
          onBefore: () => {
            data.value = undefined;
            error.value = undefined;
          },
          onSuccess: (data) => {
            message.success(data.data);
          },
          onError: (error) => {
            message.error(error.message);
          },
        });

      return () => {
        return h("div", [
          h(
            Button,
            { type: "success", onClick: run },
            {
              default: () => "获取爱情公寓语录",
            }
          ),
          h(
            Button,
            {
              type: "success",
              onClick: () => {
                run();
                run();
                run();
              },
            },
            {
              default: () => "获取爱情公寓语录 X3",
            }
          ),
          h(
            Button,
            { type: "danger", onClick: abort },
            {
              default: () => "中止请求",
            }
          ),
          h("div", { style: "margin-top: 10px" }, [
            isFinished.value && data.value && h("h3", data.value.data),
            isFinished.value &&
              error.value &&
              h("h3", { id: "error" }, error.value.message),
            isLoading.value && h("div", h(Loading)),
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
