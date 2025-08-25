# 节流

通过设置 `throttleWait` 参数，`useRequest` 会对频繁的请求进行节流处理，**在指定时间间隔内最多只执行一次请求**，即使用户持续操作也会按固定频率执行。

节流的核心思想：**控制执行频率，定期执行**，适用于滚动加载、按钮防重复点击等场景。

## 基础用法

```ts
const { data, run } = useRequest(searchService, {
  throttleWait: 1000, // [!code ++]
});
```

Vue3Request 的节流是使用 [lodash](https://lodash.com/) 提供的 [throttle](https://lodash.com/docs/4.17.15#throttle) 实现的，`options.throttleOptions.leading` 和 `options.throttleOptions.trailing` 选项默认为 true，**因此，多次触发 throttle 会在结束后再调用一次**。

你可以通过`options.throttleOptions` 来自定义 `throttle` 的行为。

:::demo

```vue
<template>
  <section>
    <n-flex vertical>
      <n-flex justify="space-between">
        <n-flex align="center">
          <span>节流间隔：</span>
          <n-input-number
            v-model:value="throttleWait"
            :min="1000"
            :step="1000"
          />
          <n-flex align="center" justify="space-between">
            <span>节流配置对比：</span>
            <n-flex align="center">
              <n-checkbox v-model:checked="throttleOptions.leading"
                >leading (立即执行)</n-checkbox
              >
              <n-checkbox v-model:checked="throttleOptions.trailing"
                >trailing (结束后执行)</n-checkbox
              >
            </n-flex>
          </n-flex>
        </n-flex>
      </n-flex>
      <n-flex align="center">
        <n-input v-model:value="searchQuery" clearable />
        <n-text :depth="3"> 搜索请求次数: {{ requestCount }} </n-text>
      </n-flex>
      <hr />
      <n-spin :show="loading">
        <n-list v-if="data && data.data.length">
          <n-list-item v-for="user in data.data" :key="user.id">
            <n-flex align="center">
              <n-avatar :src="user.avatar" round />
              <div>
                <n-text strong>{{ user.name }}</n-text>
                <br />
                <n-text :depth="3">
                  {{ user.email }} | {{ user.department }}
                </n-text>
              </div>
            </n-flex>
          </n-list-item>
        </n-list>
        <n-empty v-else />
      </n-spin>
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "vue3-request";
import { ref, reactive, watch } from "vue";
import {
  NSpin,
  NInput,
  NEmpty,
  NFlex,
  NText,
  NList,
  NListItem,
  NAvatar,
  NInputNumber,
  NCheckbox,
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
  }[];
}

const searchQuery = ref("");
const requestCount = ref(0);
const throttleWait = ref(1000);
const throttleOptions = reactive({
  leading: true,
  trailing: true,
});

const searchUsers = (query: string): Promise<IResult> => {
  requestCount.value++;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchedUsers = Array.from(
        {
          length: query ? faker.number.int({ min: 1, max: 4 }) : 0,
        },
        () => {
          const gender = Math.random() > 0.5 ? "female" : "male";
          return {
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
          };
        }
      );

      resolve({
        code: 200,
        msg: "success",
        data: matchedUsers,
      });
    }, 400);
  });
};

const { data, error, loading, run } = useRequest(searchUsers, {
  manual: true,
  throttleWait,
  throttleOptions,
});

watch(searchQuery, (newValue) => {
  if (newValue.trim()) {
    run(newValue.trim());
  }
});
</script>
```

:::

## Options

| 参数            | 说明                                                            | 类型                                        | 默认值                              |
| --------------- | --------------------------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| throttleWait    | 节流等待时间（毫秒）                                            | `number \| Ref<number>`                     | -                                   |
| throttleOptions | leading: 指定调用在节流开始前，trailing: 指定调用在节流结束后 | `{ leading?: boolean, trailing?: boolean }` | `{ leading: true, trailing: true }` |
