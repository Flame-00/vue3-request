# 错误重试

通过设置 `options.errorRetryCount`，`useRequest` 会在请求失败后自动重试，当网络不稳定或服务暂时不可用时，自动重试机制能够显著提升用户体验和系统可靠性。

## 基本使用

```ts
const { data, error, loading } = useRequest(getUserInfo, {
  errorRetryCount: 3, // [!code ++]
});
```

:::demo

```vue
<template>
  <section>
    <n-blockquote> 假设重试 {{ errorRetryCount }} 次就会成功 </n-blockquote>
    <n-text strong type="info"></n-text>
    <n-flex justify="space-between" :wrap="false">
      <n-flex align="center">
        <span>重试次数:</span>
        <n-input-number v-model:value="errorRetryCount" :min="0" :step="1" />
      </n-flex>
      <n-flex align="center">
        <n-text :depth="3">
          已重试: <n-text type="error" strong>{{ executeCount }}</n-text> 次
        </n-text>
        <n-button type="primary" @click="executeRefresh"> Refresh </n-button>
      </n-flex>
    </n-flex>
    <hr />
    <n-spin :show="loading">
      <div v-if="data">
        <n-flex :wrap="false">
          <n-image :src="data.data.avatar" show-toolbar-tooltip />
          <div>
            <n-flex>
              <n-text italic>姓名:</n-text>
              <n-text :depth="3">{{ data.data.name }}</n-text>
            </n-flex>
            <n-flex>
              <n-text italic>邮箱:</n-text>
              <n-text :depth="3">{{ data.data.email }}</n-text>
            </n-flex>
            <n-flex>
              <n-text italic>部门:</n-text>
              <n-text :depth="3">{{ data.data.department }}</n-text>
            </n-flex>

            <n-flex>
              <n-text italic>身份:</n-text>
              <n-text :depth="3">{{ data.data.roles }}</n-text>
            </n-flex>
          </div>
        </n-flex>
      </div>
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <n-empty v-else size="huge" />
    </n-spin>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "vue3-request";
import { ref, computed } from "vue";
import {
  NSpin,
  NInputNumber,
  NButton,
  NEmpty,
  NFlex,
  NBlockquote,
  NText,
  NImage,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

const currentRetryCount = ref(0);
const errorRetryCount = ref(3);
const executeCount = computed(() => Math.max(0, currentRetryCount.value - 1));

interface IResult {
  code: number;
  msg: string;
  data: {
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const message = useMessage();

const executeRefresh = () => {
  currentRetryCount.value = 0;
  refresh();
};

const getUserInfo = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentRetryCount.value === errorRetryCount.value) {
        const gender = Math.random() > 0.5 ? "female" : "male";
        resolve({
          code: 200,
          msg: "success",
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName({ sex: gender }),
            email: faker.internet.email(),
            avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
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

const { data, error, loading, refresh } = useRequest(getUserInfo, {
  errorRetryCount, // [!code highlight]
  onSuccess: (data) => {
    message.success(data.msg);
  },
  onError: (error) => {
    message.error(error.message);
  },
  onFinally: () => {
    currentRetryCount.value++;
  },
});
</script>
```

:::

## Options

| 参数               | 说明                                                                                                                                                                          | 类型                    | 默认值 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ |
| errorRetryCount    | 错误重试次数。设置为 `-1` 时启用无限重试模式                                                                                                                                  | `number \| Ref<number>` | `0`    |
| errorRetryInterval | 重试间隔时间（毫秒），默认采用[指数退避算法](https://en.wikipedia.org/wiki/Exponential_backoff)，也就是第一次重试等待 2s，第二次重试等待 4s，以此类推，如果大于 30s，则取 30s | `number`                | -      |
