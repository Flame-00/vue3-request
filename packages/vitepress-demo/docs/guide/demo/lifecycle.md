# 生命周期

`useRequest` 提供了完整的请求生命周期管理，让你可以在请求的不同阶段执行相应的业务逻辑，实现更精细化的控制和用户体验优化。

- 🚀 **onBefore** - 请求发起之前
- ✅ **onSuccess** - 请求成功完成时
- ❌ **onError** - 请求失败或抛出异常时
- 🏁 **onFinally** - 请求完成时（无论成功或失败）

## 基本使用

:::demo

```vue
<template>
  <section>
    <n-button type="primary" @click="getUserInfo">
      Obtain user information
    </n-button>
    <hr />
    <n-spin :show="loading">
      <n-flex v-if="data">
        <n-image show-toolbar-tooltip :src="data.data.avatar" />
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
import { useRequest } from "vue3-request";
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

## Options

| 参数      | 说明                   | 类型                                           | 默认值 |
| --------- | ---------------------- | ---------------------------------------------- | ------ |
| onBefore  | Service 执行前触发     | `(params: P) => void`                          | -      |
| onSuccess | Service resolve 时触发 | `(data: D, params: P) => void`                 | -      |
| onError   | Service reject 时触发  | `(error: Error, params: P) => void`            | -      |
| onFinally | Service 执行完成时触发 | `(params: P, data?: D, error?: Error) => void` | -      |
