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

const show = ref(true);

function generateComponent() {
  return {
    setup() {
      interface IResult {
        code: number;
        msg: string;
        data: string;
      }

      const message = useMessage();

      const lastName = ref("李");

      const testService = (lastName: string): Promise<IResult> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 模拟50%的几率出错
            if (Math.random() > 0.5) {
              resolve({
                code: 200,
                msg: "success",
                data: `${lastName}${faker.person.firstName()}`,
              });
            } else {
              reject(new Error("Failed to generate full name!"));
            }
          }, 1000);
        });
      };

      const { run, data, error, isLoading, cancel } = useRequest(testService, {
        manual: true,
        onSuccess: (data, params) => {
          message.success(`params -> "${params}"`);
        },
        onError: (error, params) => {
          message.error(error.message);
        },
      });

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
                  onClick: cancel,
                },
                () => "cancel"
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
                !error.value &&
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
