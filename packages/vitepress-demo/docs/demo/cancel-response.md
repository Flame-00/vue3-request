# 取消响应

`useRequest` 提供了 `cancel` 函数，用于忽略当前 promise 返回的数据和错误

## `cancel()`

:::warning
**注意：调用 `cancel` 函数并不会取消 promise 的执行**

只是**取消**对 data 和 error 的赋值和生命周期事件的调用

中止正在请求的接口请查阅 [中止请求](./abort-request.md)
:::

同时 `useRequest` 会在以下时机自动忽略响应：

- 组件卸载时，正在进行的 promise
- 竞态取消，当上一次 promise 还没返回时，又发起了下一次 promise，则会忽略上一次 promise 的响应

:::tip

1. 你可以多次点击发起请求, 最后只会提示成功或者失败一次
2. 在发起请求后结果还没返回前卸载组件, 会忽略响应
   :::

:::demo

```vue
<template>
  <ChildComponent v-if="show" />
  <hr />
  <Button type="info" @click="show = !show">{{
    show ? "隐藏组件" : "显示组件"
  }}</Button>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import message from "@/utils/message"; // demo component
import { h, ref } from "vue";
import Loading from "../components/Loading.vue"; // demo component
import Button from "../components/Button.vue"; // demo component

const show = ref(true);

const testService = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("我是数据");
      } else {
        reject(new Error("接口错误"));
      }
    }, 1500);
  });
};

function generateComponent() {
  return {
    setup() {
      const { run, data, error, isLoading, cancel } = useRequest(
        () => testService,
        {
          manual: true,
          onSuccess: (data) => {
            message.success(data);
          },
          onError: (error) => {
            console.log(error);
            message.error(error);
          },
        }
      );
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
            { type: "danger", onClick: cancel },
            {
              default: () => "取消响应",
            }
          ),
          h("div", { style: "margin: 10px" }, [
            data.value && h("h3", data.value),
            error.value && h("h3", { id: "error" }, error.value.message),
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
