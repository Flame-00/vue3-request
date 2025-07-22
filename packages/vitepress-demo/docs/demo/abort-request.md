# 中止请求

`useRequest` 提供了 `abort` 函数，用于中止尚未完成的接口请求

在执行 `useRequest` 的时候,无论是自动还是手动调用, 都会在其参数内部自动生成一个`signal`参数提供给开发者用来取消请求, 这样可以省去开发者自己定义 `new AbortController()`的繁琐

## `abort()`

同时 `useRequest` 会在以下时机自动中止请求：

使用的是 `xhr` 或 `fetch` 请求，并添加了`signal(必须)`参数

- 组件卸载时，还未返回结果的请求
- 竞态请求，当上一次 请求结果 还没返回时，又发起了下一次 请求，则会忽略上一次 请求 的响应**并中止请求**

:::tip

1. 你可以在浏览器选项卡的**Network**设置网速为 3G **(网速快接口返回的很快)**
2. 然后多次点击发起请求, 最后只会提示成功一次
3. 然后试试在发起请求后结果还没返回前卸载组件, 会忽略响应并中止请求
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
import message from "@/utils/message"; // demo component
import Loading from "../components/Loading.vue"; // demo component
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import mock from "@/utils/faker";
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
            { type: "primary", onClick: run },
            {
              default: () => "发起请求",
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
