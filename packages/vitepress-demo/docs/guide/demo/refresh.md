# 刷新（重复上一次请求）

`useRequest` 提供了 `refresh` 和 `refreshAsync` 方法，让您能够使用**上一次请求的参数**重新发起请求。这种方式在处理复杂参数时特别有用，避免了参数的重复管理。

## 基本使用

以用户信息管理为例：

1. 首次调用 `getUserInfo(1)` 获取 ID 为 1 的用户信息
2. 通过其他操作（如表单提交）更新了该用户的信息
3. 调用 `refresh()` 重新获取该用户的最新信息，无需再次传递用户 ID

:::demo

```vue
<template>
  <section>
    <n-button type="primary" @click="refresh"> Refresh </n-button>
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
    <h3>params: {{ params }}</h3>
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
    id: string | number;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}
const message = useMessage();

const service = (id: number): Promise<IResult> => {
  message.info(`use-request-refresh-id -> "${id}"`);
  return new Promise((resolve, reject) => {
    const gender = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: {
            id,
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
  refresh,
  data,
  params,
  error,
  loading,
} = useRequest(service, {
  manual: true,
});

getUserInfo(1);
</script>
```

:::

`refresh` 和 `refreshAsync` 的区别和 `run` 和 `runAsync` 是一致的。

## Result

| 参数         | 说明                                                             | 类型               |
| ------------ | ---------------------------------------------------------------- | ------------------ |
| refresh      | 使用上一次的 params，重新调用 `run`，同步执行                    | `() => void`       |
| refreshAsync | 使用上一次的 params，重新调用 `runAsync`，异步执行，返回 Promise | `() => Promise<D>` |

## 贡献者 :shamrock:

<Team />