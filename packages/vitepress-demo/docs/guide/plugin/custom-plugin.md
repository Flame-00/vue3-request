# 自定义插件

Vue3Request 提供了强大而灵活的插件系统，允许你根据业务需求开发自定义插件，扩展 `useRequest` 的功能。通过插件机制，你可以在请求的各个生命周期阶段注入自定义逻辑。

## 插件结构

一个 Vue3Request 插件本质上是一个函数，接收 `requestInstance` 和 `options` 参数，返回一个包含生命周期钩子的对象：

插件作为`useRequest`的第三个参数，需要传递一个数组，数组里的插件执行顺序采用洋葱模型（倒序执行）

你可以使用 Vue3Request 导出的 `definePlugin` 方法来定义插件，此方法具有丰富的 TS 类型提示

```ts
const definePlugin: <D = any, P extends any[] = any, O = {}>(
  plugin: Plugin<D, P, O>
) => Plugin<D, P, O>;
```

泛型 `D` 是 `data` 的类型，即 `requestInstance.state.data`；泛型 `P` 是 `params` 的类型，即 `requestInstance.state.params` 和 `options.defaultParams`；泛型 `O` 用来扩展 `options` 对象的属性

详细说明请参考 [API 文档 - definePlugin](/API/#defineplugin)。

```ts
import { useRequest, definePlugin } from "vue3-request";

interface IResult {
  code: number;
  msg: string;
  data: {
    name: string;
    age: number;
  };
}

const service = ({ id }: { id: number }): Promise<IResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          name: "zs",
          age: 24,
        },
      });
    }, 1000);
  });
};

interface IPlugin {
  level: string;
}

const customPlugin = definePlugin<IResult, [{ id: number }], IPlugin>(
(requestInstance, options) => {
    // 插件初始化逻辑

    return {
      onBefore: (params) => {
        // 请求前执行，对应 options.onBefore
      },
      onRequest: (service) => {
        // 请求时执行，可以修改 service
        // 必须返回一个新的 service 函数
        return service;
      },
      onSuccess: (params) => {
        // 请求成功时执行，对应 options.onSuccess
        // 如需访问响应数据，使用 requestInstance.state.data
        console.log('响应数据:', requestInstance.state.data);
      },
      onError: (params) => {
        // 请求失败时执行，对应 options.onError
        // 如需访问错误信息，使用 requestInstance.state.error
        console.log('错误信息:', requestInstance.state.error);
      },
      onFinally: (params) => {
        // 请求完成时执行（无论成功或失败），对应 options.onFinally
        // 可以同时访问 data 和 error
        const { data, error } = requestInstance.state;
        if (data) {
          console.log('请求成功');
        }
        if (error) {
          console.log('请求失败');
        }
      },
      onCancel: () => {
        // 请求取消时执行，对应 cancel() 方法
      },
    };
  }
);
const { data, loading } = useRequest(
  service,
  {
    level: "1", // [!code ++]
  },
  [customPlugin] // [!code ++]
);
```

## 实战示例

### 请求日志插件

:::tip
打开控制台查看日志打印
:::

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-button type="primary" @click="getUserInfo">
        Obtain user information
      </n-button>
      <n-button type="warning" @click="cancel"> Cancel </n-button>
    </n-flex>
    <hr />
    <n-spin :show="loading">
      <n-flex :wrap="false" v-if="data">
        <n-image show-toolbar-tooltip :src="data.data.avatar" style="flex:1;" />
        <div>
          <n-flex>
            <n-text italic> 姓名: </n-text>
            <n-text depth="3"> {{ data.data.name }} </n-text>
          </n-flex>
          <n-flex>
            <n-text italic> 邮箱: </n-text>
            <n-text depth="3"> {{ data.data.email }} </n-text>
          </n-flex>
          <n-flex>
            <n-text italic> 部门: </n-text>
            <n-text depth="3"> {{ data.data.department }} </n-text>
          </n-flex>

          <n-flex>
            <n-text italic> 身份: </n-text>
            <n-text depth="3"> {{ data.data.roles }} </n-text>
          </n-flex>
        </div>
      </n-flex>
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <n-empty size="huge" v-else />
    </n-spin>
  </section>
</template>
<script setup lang="ts">
import { useRequest, definePlugin } from "vue3-request";
import { ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

// 定义插件选项类型
interface LogOptions {
  logLevel: keyof Console;
  logPrefix: string;
}

const customPlugin = definePlugin<IResult, [], LogOptions>(
  (requestInstance, options) => {
    const { logLevel, logPrefix } = options;

    const log = (
      level: keyof Console,
      prefix: string,
      message: string,
      timestamp?: number
    ) => {
      const l = console[level] as (...args: any[]) => void;
      l(`${prefix} ${message} ${timestamp}`);
    };
    return {
      onRequest: (service) => {
        log(
          "log",
          logPrefix,
          "请求开始",
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        );
        return async () => {
          const result = await service();
          return result;
        };
      },
      onSuccess: (params) => {
        log(
          logLevel,
          "[Success]",
          "请求成功",
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        );
        // 如需访问响应数据，使用 requestInstance.state.data
        console.log('响应数据:', requestInstance.state.data);
      },
      onError: (params) => {
        log(
          "error",
          "[Error]",
          "请求失败",
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        );
        // 如需访问错误信息，使用 requestInstance.state.error
        console.log('错误信息:', requestInstance.state.error);
      },
      onCancel: () => {
        log(
          "warn",
          "[Cancel]",
          "请求被取消",
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        );
      },
    };
  }
);

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    const gender = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName({
              sex: gender,
            }),
            email: faker.internet.email(),
            avatar: faker.image.personPortrait({
              sex: gender,
              size: 128,
            }),
            department: faker.helpers.arrayElement([
              "技术部",
              "产品部",
              "运营部",
              "设计部",
              "市场部",
            ]),

            roles: faker.helpers.arrayElement(["admin", "user"]),
          },
        });
      } else {
        reject(new Error("Failed to obtain user information!"));
      }
    }, 1000);
  });
};

const {
  run: getUserInfo,
  cancel,
  data,
  error,
  loading,
} = useRequest(
  service,
  {
    manual: true,
    logLevel: "info", // [!code highlight]
    logPrefix: "[Request]", // [!code highlight]
  },
  [customPlugin] // [!code highlight]
);
</script>
```

:::

## 更多实用插件示例

下面这些插件都只依赖 Vue3Request 的生命周期，不绑定 Axios、Fetch 或具体 UI 组件，适合直接放到项目的 `src/plugins/request` 目录中复用。

### 合并重复请求（Single Flight）

同一个接口可能被多个组件同时触发，例如页面初始化时，Header、Sidebar 和页面主体都请求当前用户。这个插件让相同 key 的请求共享同一个 Promise，避免短时间内重复访问后端。

```ts
import { definePlugin } from "vue3-request";

const pendingRequests = new Map<string, Promise<unknown>>();

interface DedupeOptions<P extends unknown[]> {
  dedupeKey?: (params: P) => string;
}

export function createDedupePlugin<D, P extends unknown[]>() {
  return definePlugin<D, P, DedupeOptions<P>>(
    (requestInstance, options) => ({
      onRequest: (service) => async (...params) => {
        if (!options.dedupeKey) return service(...params);

        const key = options.dedupeKey(requestInstance.state.params);
        const pending = pendingRequests.get(key) as Promise<D> | undefined;
        if (pending) return pending;

        const current = service(...params);
        pendingRequests.set(key, current);

        try {
          return await current;
        } finally {
          if (pendingRequests.get(key) === current) {
            pendingRequests.delete(key);
          }
        }
      },
    })
  );
}
```

```ts
type UserParams = [id: string];
const dedupePlugin = createDedupePlugin<User, UserParams>();

useRequest(getUser, {
  dedupeKey: ([id]) => `user:${id}`,
}, [dedupePlugin]);
```

key 中应包含接口身份和全部有效参数。这里只合并进行中的请求；请求结束后的数据复用仍交给内置缓存插件处理。

### Token 失效后刷新并重放

多个请求同时收到 `401` 时，通常只应刷新一次 Token，其余请求等待刷新完成后再重放。模块级的 `refreshingToken` 用于避免并发刷新。

```ts
import { definePlugin } from "vue3-request";

let refreshingToken: Promise<void> | null = null;

interface AuthRefreshOptions {
  isUnauthorized?: (error: unknown) => boolean;
  refreshToken?: () => Promise<void>;
}

export function createAuthRefreshPlugin<D, P extends unknown[]>() {
  return definePlugin<D, P, AuthRefreshOptions>((_request, options) => ({
    onRequest: (service) => async (...params) => {
      try {
        return await service(...params);
      } catch (error) {
        if (
          !options.refreshToken ||
          !options.isUnauthorized?.(error)
        ) {
          throw error;
        }

        refreshingToken ??= options.refreshToken().finally(() => {
          refreshingToken = null;
        });

        await refreshingToken;
        return service(...params);
      }
    },
  }));
}
```

```ts
const authRefreshPlugin = createAuthRefreshPlugin<Order[], []>();

useRequest(getOrders, {
  isUnauthorized: (error) =>
    axios.isAxiosError(error) && error.response?.status === 401,
  refreshToken: authStore.refreshToken,
}, [authRefreshPlugin]);
```

重放只执行一次，不会出现无限刷新循环。实际项目中，刷新失败后还应由 `authStore` 统一清理登录状态并跳转登录页。

### 限制全局并发数

批量加载图片详情、报表分片或大量下拉选项时，无限制并发容易挤占浏览器连接、触发网关限流。下面的插件让同一插件实例下的请求排队执行。

```ts
import { definePlugin } from "vue3-request";

export function createConcurrencyPlugin<
  D,
  P extends unknown[]
>(maxConcurrent: number) {
  if (!Number.isInteger(maxConcurrent) || maxConcurrent <= 0) {
    throw new RangeError("maxConcurrent must be a positive integer");
  }

  let activeCount = 0;
  const queue: Array<() => void> = [];

  const acquire = () => new Promise<void>((resolve) => {
    if (activeCount < maxConcurrent) {
      activeCount += 1;
      resolve();
      return;
    }
    queue.push(() => {
      activeCount += 1;
      resolve();
    });
  });

  const release = () => {
    activeCount -= 1;
    queue.shift()?.();
  };

  return definePlugin<D, P>((_request, _options) => ({
    onRequest: (service) => async (...params) => {
      await acquire();
      try {
        return await service(...params);
      } finally {
        release();
      }
    },
  }));
}
```

```ts
// 在模块顶层创建一次，所有使用它的实例共享最多 4 个并发名额
const reportConcurrencyPlugin =
  createConcurrencyPlugin<ReportChunk, [chunkId: string]>(4);

useRequest(loadReportChunk, {}, [reportConcurrencyPlugin]);
```

若在每个组件内部重新创建插件，每个组件会拥有独立队列，也就无法实现跨组件限流。

### 失败时返回降级数据

推荐列表、运营配置等非核心接口失败时，与其让整个页面进入错误态，通常更适合返回本地默认值。该插件只处理明确允许降级的错误。

```ts
import { definePlugin } from "vue3-request";

interface FallbackOptions<D, P extends unknown[]> {
  shouldFallback?: (error: unknown) => boolean;
  fallback?: (error: unknown, params: P) => D | Promise<D>;
}

export function createFallbackPlugin<D, P extends unknown[]>() {
  return definePlugin<D, P, FallbackOptions<D, P>>(
    (requestInstance, options) => ({
      onRequest: (service) => async (...params) => {
        try {
          return await service(...params);
        } catch (error) {
          if (
            !options.fallback ||
            !options.shouldFallback?.(error)
          ) {
            throw error;
          }

          return options.fallback(error, requestInstance.state.params);
        }
      },
    })
  );
}
```

```ts
const fallbackPlugin = createFallbackPlugin<Banner[], []>();

useRequest(getBanners, {
  shouldFallback: (error) => !navigator.onLine || isTimeoutError(error),
  fallback: () => localStorageBanners,
}, [fallbackPlugin]);
```

降级成功后，请求会进入 `onSuccess` 而不是 `onError`。因此它适合“默认数据也算有效结果”的非核心接口，不应该用于订单提交、支付等写操作。

这些插件可以组合使用。由于 `onRequest` 按洋葱模型执行，插件数组中靠前的插件位于外层，可以观察到内层插件处理后的最终结果或错误；生命周期型插件则按照插件数组顺序依次执行。

通过自定义插件，你可以将 `useRequest` 扩展到任何业务场景，实现高度定制化的异步数据管理解决方案。

## 贡献者 :shamrock:

<Team />
