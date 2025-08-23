# 自定义插件

Vue3Request 提供了强大而灵活的插件系统，允许你根据业务需求开发自定义插件，扩展 `useRequest` 的功能。通过插件机制，你可以在请求的各个生命周期阶段注入自定义逻辑。

## 插件基础

### 插件结构

一个 Vue3Request 插件本质上是一个函数，接收 `requestInstance` 和 `options` 参数，返回一个包含生命周期钩子的对象：

```ts
import { definePlugin } from "@async-handler/request/vue3-request";

const customPlugin = definePlugin((requestInstance, options) => {
  // 插件初始化逻辑
  console.log(requestInstance, options);
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
});
```

## 实战示例

### 请求日志插件

:::demo

```vue
<template>
  <section>
    <n-button type="primary" @click="getUserInfo">
      Obtain user information
    </n-button>
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
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import {
  NSpin,
  NButton,
  NEmpty,
  NFlex,
  NText,
  NImage,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

interface LogOptions {
  logLevel?: "info" | "warn" | "error";
  logPrefix?: string;
}

const plugin = definePlugin<number, [], LogOptions>(
  (requestInstance, options) => {
    const { logLevel = "info", logPrefix = "[Request]" } = options;
    console.log(options, "options");
    const log = (level: keyof Console, message: string) => {
      console[level as keyof Console](`${logPrefix} ${message}`);
    };

    return {
      onBefore: (params) => {
        log(logLevel, "请求开始", { params, timestamp: Date.now() });
      },

      onRequest: (service) => {
        const startTime = Date.now();

        return async () => {
          try {
            const result = await service();
            const duration = Date.now() - startTime;
            log(logLevel, "请求成功", { duration });
            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            log("error", "请求失败", { duration, error });
            throw error;
          }
        };
      },

      onCancel: () => {
        log("warn", "请求被取消");
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

const message = useMessage();

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
  data,
  error,
  loading,
} = useRequest(service, {
  manual: true,
});
</script>
```

:::

通过自定义插件，你可以将 Vue3Request 扩展到任何业务场景，实现高度定制化的异步数据管理解决方案。
