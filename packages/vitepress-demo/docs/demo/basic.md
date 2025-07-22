# 基础用法

vue3-request 最核心，最基础的能力

## 默认请求

`useRequest` 是一个强大的异步数据管理的 Hooks

默认情况下，`useRequest` 第一个参数是一个[异步函数](../FAQ/#什么是异步函数?)，在组件初始化时，会自动执行该异步函数。同时自动管理该异步函数返回的 `loading`, `data`, `error` 等状态。

```ts
import { useRequest } from "@async-handler/request/vue3-request";

// 模拟异步请求
const testService = (): Promise<string> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        data: "我是数据",
        msg: "success",
      });
    }, 1000);
  });
};

const { data, error, loading } = useRequest(testService); // [!code ++]
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
    <pre v-if="dataAxios">{{ dataAxios }}</pre>
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
import { useRequest } from "@async-handler/request/vue3-request";
import axios from "axios";

// 模拟请求示例
const testService = (): Promise<{
  code: number;
  msg: string;
  data: string;
  success: boolean;
  request_id: string;
}> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: "我是假数据",
        request_id: "278c3c4d23e30b38a11df8ed",
      });
    }, 2500);
  });
};
const { run, data, error, isLoading } = useRequest(testService);

// axios
const axiosInstance = axios.create({
  // ...
});
// 响应拦截器，自己业务项目想怎么配置都可以
axiosInstance.interceptors.response.use((response) => response.data);

const testServiceAxios = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return axiosInstance.get("https://v2.xxapi.cn/api/renjian");
};
const {
  data: dataAxios,
  error: errorAxios,
  isLoading: isLoadingAxios,
} = useRequest(testServiceAxios);

// fetch
const testServiceFetch = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return fetch("https://v2.xxapi.cn/api/aiqinggongyu", {
    method: "GET",
  }).then((response) => response.json());
};
const {
  data: dataFetch,
  error: errorFetch,
  isLoading: isLoadingFetch,
} = useRequest(testServiceFetch);
</script>
```

:::

## 手动触发

如果设置了 `options.manual = true`，则 `useRequest` 不会默认执行，需要通过 `run` 或者 `runAsync` 来触发执行。

```ts
const { loading, run, runAsync } = useRequest(() => testService, {
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

接下来我们为 mock 出的假人物名字添加一个姓氏，来演示 `useRequest` 手动触发模式，以及 `run` 与 `runAsync` 的区别。

### run

在这个例子中，我们通过 `run(xing)` 来为 mock 出的假人物名字添加一个姓氏，通过 `onSuccess` 和 `onError `来处理成功和失败。
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
    <div v-else>
      <pre v-if="data">{{ data }}</pre>
      <pre v-if="error">{{ error.message }}</pre>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import message from "@/utils/message";
import mock from "@/utils/faker";

const xing = ref("范");
interface IName {
  code: number;
  msg: string;
  data: string;
}

const testService = (xing: string): Promise<IName> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: `${xing}${mock.person.firstName()}`,
        });
      } else {
        reject(new Error("接口错误"));
      }
    }, 1000);
  });
};

const { run, data, error, isLoading } = useRequest(testService, {
  manual: true,
  onBefore: () => {
    data.value = undefined;
    error.value = undefined;
  },
  onSuccess: (data, params) => {
    message.success(`params -> "${params}"`);
  },
  onError: (error, params) => {
    message.error(error.message);
  },
});
</script>
```

:::

### runAsync

在这个例子中，我们通过 `runAsync(xing)` 来为 mock 出的假人物名字添加一个姓氏，此时必须通过 `catch` 来自行处理异常。
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
  <Button type="primary" @click="onClick">生成全名</Button>
  <section>
    <Loading v-if="isLoading" />
    <div v-else>
      <pre v-if="data">{{ data }}</pre>
      <pre v-if="error">{{ error.message }}</pre>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import message from "@/utils/message";
import mock from "@/utils/faker";

const xing = ref("范");
interface IName {
  code: number;
  msg: string;
  data: string;
}

const testService = (xing: string): Promise<IName> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: `${xing}${mock.person.firstName()}`,
        });
      } else {
        reject(new Error("接口错误"));
      }
    }, 1000);
  });
};

const onClick = async () => {
  data.value = undefined;
  error.value = undefined;
  try {
    await runAsync(xing.value);
    message.success(`params -> "${params.value}"`);
  } catch (error) {
    message.error(error.message);
  }
};

const { runAsync, data, error, isLoading, params } = useRequest(testService, {
  manual: true,
});
</script>
```

:::
