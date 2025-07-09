# 基础用法

这一小节我们会介绍 `vue3-async-handler` 最核心，最基础的能力，也就是 `vue3-async-handler` 内核的能力。

## 默认请求

默认情况下，`useAsyncHandler` 第一个参数是一个工厂函数返回一个[异步函数](../FAQ/#什么是异步函数?)，在组件初始化时，会自动执行该工厂函数 并在其参数内部生成一个`signal(可选)`提供给开发者用来[取消请求](./cancel-request.md)。同时自动管理该工厂函数返回的异步函数的 `loading`, `data`, `error` 等状态。

[为什么要用工厂函数返回一个异步函数, 而不是直接返回异步函数?](../FAQ/#为什么要用工厂函数返回一个异步函数)

```ts
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";

// 模拟异步请求
const testService = (): Promise<string> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        data: "我是数据",
      });
    }, 1500);
  });
};

// ✅ 工厂函数返回一个异步函数
const { data, error, loading } = useAsyncHandler(() => testService);

// ❌ 直接返回一个异步函数
const { data, error, loading } = useAsyncHandler(testService); // [!code error]
```

::: tip
打开控制台, 查看组件初始化后自动执行的 `testService` 函数
:::

:::demo

```vue
<template>
  <section>
    <h3>模拟请求</h3>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
  <hr />
  <section>
    <h3>axios</h3>
    <Loading v-if="isLoadingAxios" />
    <pre v-if="dataAxios">{{ dataAxios?.data }}</pre>
    <pre v-if="errorAxios">{{ errorAxios }}</pre>
  </section>
  <hr />
  <section>
    <h3>fetch</h3>
    <Loading v-if="isLoadingFetch" />
    <pre v-if="dataFetch">{{ dataFetch }}</pre>
    <pre v-if="errorFetch">{{ errorFetch }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import axios from "axios";

// 模拟请求示例
const testService = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "数据请求成功",
        data: "我是假数据",
        request_id: "278c3c4d23e30b38a11df8ed",
      });
    }, 2500);
  });
};
const { run, data, error, isLoading } = useAsyncHandler(() => testService);

// axios
const testServiceAxios = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return axios.get("https://v2.xxapi.cn/api/renjian");
};
const {
  data: dataAxios,
  error: errorAxios,
  isLoading: isLoadingAxios,
} = useAsyncHandler(() => testServiceAxios);

// fetch
const testServiceFetch = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  // fetch需处理返回格式
  return fetch("https://v2.xxapi.cn/api/aiqinggongyu", {
    method: "GET",
  }).then((response) => response.json());
};
const {
  data: dataFetch,
  error: errorFetch,
  isLoading: isLoadingFetch,
} = useAsyncHandler(() => testServiceFetch);
</script>
```

:::

## 手动触发

如果设置了 `options.manual = true`，则 `useAsyncHandler` 不会默认执行，需要通过 `run` 或者 `runAsync` 来触发执行。

```ts
const { loading, run, runAsync } = useAsyncHandler(() => testService, {
  manual: true, // [!code ++]
});
```

`run` 与 `runAsync` 的区别在于：

- `run` 是一个普通的同步函数，我们会自动捕获异常，你可以通过 `options.onError` 来处理异常时的行为。
- `runAsync` 是一个返回 Promise 的异步函数，如果使用 `runAsync` 来调用，则意味着你需要自己捕获异常。

```ts
runAsync()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

接下来我们通过根据姓氏生成随机姓名，来演示 `useAsyncHandler` 手动触发模式，以及 `run` 与 `runAsync` 的区别。

### run

在这个例子中，我们通过 `run(xing)` 来生成随机姓名，通过 `onSuccess` 和 `onError `来处理成功和失败。
:::demo

```vue
<template>
  <input id="ipt" type="text" placeholder="输入姓氏" v-model="xing" />
  <Button type="primary" @click="() => run(xing)">生成姓名</Button>
  <section>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data?.data.data ?? data?.data.msg }}</pre>
    <pre id="error" v-if="error">{{ error }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { ref } from "vue";
import message from "@/utils/message";
import delay from "@/utils/delay";

const xing = ref("范");

interface IName {
  data: {
    code: number;
    msg: string;
    data: string[];
  };
}

const testService = async (xing: string): Promise<IName> => {
  if (Math.random() > 0.5) {
    // 模拟50%的几率出错
    await delay(1000); // 延时函数
    return Promise.reject(new Error("接口错误"));
  }
  return axios.get(
    "https://api.pearktrue.cn/api/name/generate?sex=all&count=5",
    {
      params: {
        xing,
      },
    }
  );
};

const { run, data, error, isLoading } = useAsyncHandler(() => testService, {
  manual: true,
  onSuccess: (data, params) => {
    message.success(`The xing was changed to "${params}"`);
  },
  onError: (error, params) => {
    message.error(`${error}-----${params}`);
  },
});
</script>
```

:::

### runAsync

在这个例子中，我们通过 `runAsync(xing)` 来生成随机姓名，此时必须通过 `catch` 来自行处理异常。
:::demo

```vue
<template>
  <input id="ipt" type="text" placeholder="输入姓氏" v-model="xing" />
  <Button type="primary" @click="onClick">生成姓名</Button>
  <section>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data?.data.data ?? data?.data.msg }}</pre>
    <pre id="error" v-if="error">{{ error }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { ref } from "vue";
import message from "@/utils/message";
import delay from "@/utils/delay";

const xing = ref("范");

interface IName {
  data: {
    code: number;
    msg: string;
    data: string[];
  };
}

const testService = async (xing: string): Promise<IName> => {
  if (Math.random() > 0.5) {
    // 模拟50%的几率出错
    await delay(1000); // 延时函数
    return Promise.reject(new Error("接口错误"));
  }
  return axios.get(
    "https://api.pearktrue.cn/api/name/generate?sex=all&count=5",
    {
      params: {
        xing,
      },
    }
  );
};

const { runAsync, data, error, isLoading, params } = useAsyncHandler(
  () => testService,
  {
    manual: true,
  }
);

async function onClick() {
  try {
    const res = await runAsync(xing.value);
    message.success(`The xing was changed to "${params.value}"`);
  } catch (error) {
    message.error(`${error}-----${params.value}`);
  }
}
</script>
```

:::
