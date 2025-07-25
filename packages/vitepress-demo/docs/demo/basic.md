# 基础用法

掌握 Vue3Request 的核心功能，开启高效异步数据管理之旅

## 默认请求

`useRequest` 是一个强大的异步数据管理 Hook，为你的 Vue3 应用提供完整的请求状态管理解决方案。

只需传入一个[异步函数](../FAQ/#什么是异步函数?)作为第一个参数，`useRequest` 就会在组件初始化时自动执行该函数，并智能管理整个请求生命周期中的 `data`、`error`、`isLoading` 等状态，让你专注于业务逻辑而非状态管理的繁琐细节。

```ts
const { data, error, loading } = useRequest(testService);
```

以下示例展示了 `useRequest` 与不同请求库的完美兼容性：

:::demo

```vue
<template>
  <section>
    <n-card title="模拟请求">
      <n-spin :show="isLoading">
        <pre>{{ error ? error.message : data }}</pre>
        <n-empty v-if="!error && !data" description="暂无数据"> </n-empty>
      </n-spin>
    </n-card>
  </section>
  <hr />
  <section>
    <n-card title="Axios">
      <n-spin :show="isLoadingAxios">
        <pre>{{ errorAxios ? errorAxios.message : dataAxios }}</pre>
        <n-empty v-if="!errorAxios && !dataAxios" description="暂无数据">
        </n-empty>
      </n-spin>
    </n-card>
  </section>
  <hr />
  <section>
    <n-card title="Fetch">
      <n-spin :show="isLoadingFetch">
        <pre>{{ errorFetch ? errorFetch.message : dataFetch }}</pre>
        <n-empty v-if="!errorFetch && !dataFetch" description="暂无数据">
        </n-empty>
      </n-spin>
    </n-card>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import axios from "axios";
import { NSpin, NEmpty, NCard } from "naive-ui";
import faker from "@/utils/faker";

interface IResult {
  code: number;
  msg: string;
  data: string;
  request_id: string;
}

const testService = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    console.log("testService");
    // 模拟50%的几率出错
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: faker.food.description(),
          request_id: faker.string.uuid(),
        });
      } else {
        reject(new Error("模拟接口错误"));
      }
    }, 1000);
  });
};
const { run, data, error, isLoading } = useRequest(testService);

// Axios
const axiosInstance = axios.create({
  // ...
});
// 响应拦截器，自己业务项目想怎么配置都可以
axiosInstance.interceptors.response.use((response) => response.data);

const testServiceAxios = (): Promise<IResult> => {
  return axiosInstance.get("https://v2.xxapi.cn/api/renjian");
};
const {
  data: dataAxios,
  error: errorAxios,
  isLoading: isLoadingAxios,
} = useRequest(testServiceAxios);

// Fetch
const testServiceFetch = (): Promise<IResult> => {
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

在某些业务场景中，你可能希望精确控制请求的执行时机。通过设置 `options.manual = true`，`useRequest` 将不会在组件初始化时自动执行，而是等待你主动调用 `run` 或 `runAsync` 方法。

```ts
const { loading, run, runAsync } = useRequest(() => testService, {
  manual: true, // [!code ++]
});
```

### 两种执行方式的选择

`useRequest` 提供了两种手动执行方式，以适应不同的使用场景：

**🔸 `run` 方法**

- **特点**：同步调用，内置异常处理
- **适用场景**：希望统一处理错误的业务场景
- **优势**：异常会被自动捕获，你可以通过 `options.onError` 回调统一处理错误逻辑

**🔸 `runAsync` 方法**

- **特点**：异步调用，返回 Promise
- **适用场景**：需要自定义异常处理的复杂业务逻辑
- **优势**：提供更灵活的错误处理方式，支持 async/await 语法

```ts
// 使用 runAsync 的典型模式
runAsync()
  .then((data) => {
    console.log("请求成功:", data);
  })
  .catch((error) => {
    console.error("请求失败:", error);
  });
```

为了更直观地展示两种方式的区别，下面我们通过一个实际的姓名生成器示例来演示它们的用法。

### run

在这个示例中，我们使用 `run(lastName)` 方法为模拟人物添加姓氏，通过 `onSuccess` 和 `onError` 回调来统一处理成功和失败的情况：

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-input type="text" placeholder="输入姓氏" v-model:value="lastName" />
      <n-button type="primary" @click="() => run(lastName)">
        Add the surname
      </n-button>
    </n-flex>
    <hr />
    <n-spin :show="isLoading">
      <n-empty size="huge" v-if="!error && !data" />
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <pre v-else>{{ data }}</pre>
    </n-spin>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
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

const message = useMessage();

const lastName = ref("范");
interface IName {
  code: number;
  msg: string;
  data: string;
}

const testService = (lastName: string): Promise<IName> => {
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

const { run, data, error, isLoading } = useRequest(testService, {
  manual: true, // [!code highlight]
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

在这个示例中，我们使用 `runAsync(lastName)` 方法实现相同的功能，但采用 Promise 的方式自行处理异常：

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-input type="text" placeholder="输入姓氏" v-model:value="lastName" />
      <n-button type="primary" @click="onClick"> Add the surname </n-button>
    </n-flex>
    <hr />
    <n-spin :show="isLoading">
      <n-empty size="huge" v-if="!error && !data" />
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <pre v-else>{{ data }}</pre>
    </n-spin>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
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

const message = useMessage();

const lastName = ref("范");
interface IName {
  code: number;
  msg: string;
  data: string;
}

const testService = (lastName: string): Promise<IName> => {
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

const { runAsync, data, error, isLoading, params } = useRequest(testService, {
  manual: true, // [!code highlight]
});

const onClick = async () => {
  try {
    await runAsync(lastName.value);
    message.success(`params -> "${params.value}"`);
  } catch (error) {
    message.error(error.message);
  }
};
</script>
```

:::
