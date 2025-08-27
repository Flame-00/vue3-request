# 防抖

通过设置 `debounceWait` 参数，`useRequest` 会对频繁的请求进行防抖处理，有效减少不必要的网络请求。

防抖的核心思想：**等待用户完成操作后再执行**，适用于搜索框、文本编辑器实时保存 ​ 等场景。

## 基础用法

```ts
const { data, run } = useRequest(searchService, {
  debounceWait: 1000, // [!code ++]
});
```

Vue3Request 的防抖是使用 [lodash](https://lodash.com/) 提供的 [debounce](https://lodash.com/docs/4.17.15#debounce) 实现的

你可以通过`options.debounceOptions` 来自定义 `debounce` 的行为。

:::demo

```vue
<template>
  <section>
    <n-flex vertical>
      <n-flex justify="space-between">
        <n-flex align="center">
          <span>防抖间隔：</span>
          <n-input-number
            v-model:value="debounceWait"
            :min="1000"
            :step="1000"
          />
          <n-flex align="center" justify="space-between">
            <span>防抖配置对比：</span>
            <n-flex align="center">
              <n-checkbox v-model:checked="debounceOptions.leading"
                >leading (立即执行)</n-checkbox
              >
              <n-checkbox v-model:checked="debounceOptions.trailing"
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
const debounceWait = ref(1000);
const debounceOptions = reactive({
  leading: false,
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
  debounceWait,
  debounceOptions,
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

| 参数            | 说明                                                          | 类型                                        | 默认值                               |
| --------------- | ------------------------------------------------------------- | ------------------------------------------- | ------------------------------------ |
| debounceWait    | 防抖等待时间（毫秒）                                          | `number \| Ref<number>`                     | -                                    |
| debounceOptions | leading: 指定调用在防抖开始前，trailing: 指定调用在防抖结束后 | `{ leading?: boolean, trailing?: boolean }` | `{ leading: false, trailing: true }` |

## 贡献者 :shamrock:

<Team />