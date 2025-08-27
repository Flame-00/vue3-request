# 取消响应

`useRequest` 提供了 `cancel` 方法，用于忽略当前 promise 返回的数据和错误

:::warning
**注意：调用 `cancel` 函数并不会取消 promise 的执行**

只是**取消**对 data 和 error 的赋值和生命周期事件的调用

中止正在请求的接口请查阅 [中止请求](./abort-request.md)
:::

同时 `useRequest` 会在以下时机自动忽略响应：

- 组件卸载时，正在进行的 promise
- 竞态取消，当上一次 promise 还没返回时，又发起了下一次 promise，则会忽略上一次 promise 的响应

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

      const service = (lastName: string): Promise<IResult> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 模拟50%的失败率来演示错误处理
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

      const { run, data, error, loading, cancel } = useRequest(service, {
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
                () => "Cancel"
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

| 参数   | 说明                                                            | 类型         |
| ------ | --------------------------------------------------------------- | ------------ |
| cancel | 忽略当前 Promise 的响应，不会中止请求执行，只是忽略响应结果 | `() => void` |

## 贡献者 :shamrock:

<Team />