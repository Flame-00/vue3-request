# 参数管理

`useRequest` 返回的 `params` 会记录当次调用 `service` 的参数数组。比如你触发了 `run(1, 2, 3)`，则 `params `等于 `[1, 2, 3]` 。

- `onBefore`：请求之前触发
- `onSuccess`：请求成功触发
- `onError`：请求失败触发
- `onFinally`：请求完成触发

四个[生命周期](./lifecycle.md)中都有`params`参数提供

## 默认请求

如果我们设置了 `options.manual = false`，则首次调用 `service` 的参数可以通过 `options.defaultParams` 来设置。

在这个例子中，我们通过 defaultParams 来为 mock 出的假人物名字添加一个**默认**姓氏参数

:::demo

```vue
<template>
  <input
    id="ipt"
    maxlength="1"
    type="text"
    placeholder="输入姓氏"
    v-model="xing"
  />
  <Button type="primary" @click="() => run(xing)">生成全名</Button>
  <section>
    <Loading v-if="isLoading" />
    <pre v-else>{{ data }}</pre>
    <h3>params: {{ params }}</h3>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import message from "@/utils/message";
import faker from "@/utils/faker";

const xing = ref("");
interface IName {
  code: number;
  msg: string;
  data: string;
}

const testService = (xing: string): Promise<IName> => {
  if (!xing) {
    message.error("请输入姓氏！");
    return Promise.reject(new Error("请输入姓氏！"));
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: `${xing}${faker.person.firstName()}`,
      });
    }, 1000);
  });
};

const { run, data, error, params, isLoading } = useRequest(testService, {
  defaultParams: ["范"],
});
</script>
```

:::

## 手动触发

`useRequest`使用 run 或者 runAsync 传参有两种形式，随你喜欢，想用哪种都可以， 两种传参形式都有 **TS 类型提示**

```ts
import axios from "axios";

interface IForm {
  name: string;
  age: number | null;
}

const form: IForm = reactive({
  name: "",
  age: null,
});

// 模拟异步请求
const testService = (params: IForm): Promise<IForm> => {
  return new Promise((resolve) => {
    console.log("params", params);
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          name: "张三",
          age: 18,
        },
        msg: "success",
      });
    }, 1000);
  });
};

// 第一种, 通过run runAsync 传给testService
const { run, refresh, data, params, error, isLoading } = useRequest(
  testService,
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);
onMounted(() => {
  run(form); // 拥有 testService 相同的params类型
});

// 第二种, 工厂模式
const { run, refresh, data, params, error, isLoading } = useRequest(
  (form: IForm) => testService(form),
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);
onMounted(() => {
  run(form); // 类型需要定义, 如上所写(form: IForm)
});

// 其他情况, 不用 run 或 runAsync 的工厂模式
const { run, refresh, data, params, error, isLoading } = useRequest(
  () => testService(form),
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);
onMounted(() => {
  run(); // 无参数可传也无任何类型定义
});
```
