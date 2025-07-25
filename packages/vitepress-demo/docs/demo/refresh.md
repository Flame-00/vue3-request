# 刷新（重复上一次请求）

## 概述

`useRequest` 提供了 `refresh` 和 `refreshAsync` 方法，让您能够使用**上一次请求的参数**重新发起请求。这个功能在需要重新获取最新数据时非常有用，特别是在数据可能发生变化的场景中。

这种方式在处理复杂参数时特别有用，避免了参数的重复管理。

## 示例

以用户信息管理为例：

1. 首次调用 `getUserInfo(1)` 获取 ID 为 1 的用户信息
2. 通过其他操作（如表单提交）更新了该用户的信息
3. 调用 `refresh()` 重新获取该用户的最新信息，无需再次传递用户 ID

:::demo

```vue
<template>
  <section>
    <n-button type="primary" @click="refresh">
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
    <h3>params: {{ params }}</h3>
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

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string | number;
    name: string;
    avatar: string;
    age: number;
    sex: string;
  };
}
const message = useMessage();

const testService = (id: number): Promise<IResult> => {
  message.info(`use-request-refresh-id -> "${id}"`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: {
            id,
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
  refresh,
  data,
  params,
  error,
  isLoading,
} = useRequest(testService, {
  manual: true,
});

getUserInfo(1);
</script>
```

:::

`refresh` 和 `refreshAsync` 的区别和 `run` 和 `runAsync` 是一致的。
