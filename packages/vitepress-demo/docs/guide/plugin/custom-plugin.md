# 自定义插件

Vue3Request 提供了强大而灵活的插件系统，允许你根据业务需求开发自定义插件，扩展 `useRequest` 的功能。通过插件机制，你可以在请求的各个生命周期阶段注入自定义逻辑。

## 插件结构

一个 Vue3Request 插件本质上是一个函数，接收 `requestInstance` 和 `options` 参数，返回一个包含生命周期钩子的对象：

插件作为`useRequest`的第三个参数，需要传递一个数组，数组里的插件执行顺序采用洋葱模型（倒序执行）

你可以使用 Vue3Request 导出的`definePlugin`方法来定义插件，此方法具有丰富的 TS 类型提示

```ts
const definePlugin: <D = any, P extends any[] = any, O = {}>(
  plugin: Plugin<D, P, O>
) => Plugin<D, P, O>;
```

泛型`D`是 `requestInstance.state.data` 的类型，泛型 P 是 `requestInstance.state.params` 和 `options.defaultParams` 的类型，泛型 `O` 用来扩展 `options.` 对象的属性

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
        // 请求前执行
      },
      onRequest: (service) => {
        // 请求时执行，可以修改 service
        return service;
      },
      onSuccess: (data, params) => {
        // 请求成功时执行
      },
      onError: (error, params) => {
        // 请求失败时执行
      },
      onFinally: (params, data, error) => {
        // 请求完成时执行（无论成功或失败）
      },
      onCancel: () => {
        // 请求取消时执行
      },
      onMutate: (data) => {
        // 数据变更时执行
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

const customPlugin = definePlugin<number, [], LogOptions>(
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
      onSuccess: () => {
        log(
          logLevel,
          "[Success]",
          "请求成功",
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        );
      },
      onError: () => {
        log(
          "error",
          "[Error]",
          "请求失败",
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        );
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

通过自定义插件，你可以将 `useRequest` 扩展到任何业务场景，实现高度定制化的异步数据管理解决方案。

## 贡献者 :shamrock:

<Team />