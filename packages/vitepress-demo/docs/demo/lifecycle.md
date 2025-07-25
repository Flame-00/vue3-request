# 生命周期

Vue3Request 提供了完整的请求生命周期管理，让你可以在请求的不同阶段执行相应的业务逻辑，实现更精细化的控制和用户体验优化。

## 核心生命周期

Vue3Request 的生命周期按照请求执行顺序提供以下回调：

### 🚀 **onBefore** - 请求前置处理

- **触发时机**：请求发起之前
- **参数说明**：`(params: P) => void`

### ✅ **onSuccess** - 成功响应处理

- **触发时机**：请求成功完成时
- **参数说明**：`(data: D, params: P) => void`

### ❌ **onError** - 错误处理

- **触发时机**：请求失败或抛出异常时
- **参数说明**：`(error: Error, params: P) => void`

### 🏁 **onFinally** - 最终处理

- **触发时机**：请求完成时（无论成功或失败）
- **参数说明**：`(params: P, data?: D, error?: Error) => void`

## 实际应用示例

以下示例演示了完整的用户信息获取流程，展示各个生命周期的使用场景：

:::demo

```vue
<template>
  <section>
    <n-button type="primary" @click="getUserInfo">
      Obtain user information
    </n-button>
    <hr />
    <n-spin :show="isLoading">
      <n-empty size="huge" v-if="!error && !data" />
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <template v-else>
        <n-flex :warp="false">
          <n-image
            width="256"
            height="256"
            show-toolbar-tooltip
            :src="data.data.avatar"
          />
          <div>
            <n-flex>
              <n-text italic> id: </n-text>
              <n-text depth="3"> {{ data.data.id }} </n-text>
            </n-flex>
            <n-flex>
              <n-text italic> name: </n-text>
              <n-text depth="3"> {{ data.data.name }} </n-text>
            </n-flex>
            <n-flex>
              <n-text italic> age: </n-text>
              <n-text depth="3"> {{ data.data.age }} </n-text>
            </n-flex>
            <n-flex>
              <n-text italic> sex: </n-text>
              <n-text depth="3"> {{ data.data.sex }} </n-text>
            </n-flex>
          </div>
        </n-flex>
      </template>
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

const message = useMessage();

interface IName {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    avatar: string;
    age: number;
    sex: string;
  };
}

const testService = (): Promise<IName> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName({ sex: "female" }),
            avatar: faker.image.personPortrait({ sex: "female", size: 256 }),
            sex: "女",
            age: faker.number.int({
              min: 18,
              max: 35,
            }),
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
  isLoading,
} = useRequest(testService, {
  manual: true,
  onBefore: (params) => {
    message.info(`onBefore`);
  },
  onSuccess: (data, params) => {
    message.success(`onSuccess`);
  },
  onError: (error, params) => {
    message.error(`onError`);
  },
  onFinally: (params, data, error) => {
    message.info(`onFinally`);
  },
});
</script>
```

:::
