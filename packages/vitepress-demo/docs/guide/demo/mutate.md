# 数据更改

## 概述

`useRequest` 提供了 `mutate` 方法，允许你直接修改当前的数据状态而无需重新发起请求。这在实现乐观更新、表单数据处理、用户交互反馈等场景中非常有用。

```ts
const { mutate } = useRequest(getUser);

// 直接设置
mutate(newData);

// 函数方式
mutate((data) => {
  data = newData;
});
```

只是对`data`做一些简单的修改可以考虑`computed`

```ts
const { data } = useRequest(getUser);
const newData = computed(() => `${data.value} 是个肌肉男。`);
```

## 基本用法

最简单的用法是直接传入新的数据值来替换当前状态：

:::demo

```vue
<template>
  <section>
    <n-button type="primary" @click="getUserInfo">
      Obtain user information
    </n-button>
    <hr />
    <n-spin :show="isLoading">
      <n-flex :warp="false" v-if="data">
        <n-image
          width="256"
          height="256"
          show-toolbar-tooltip
          :src="data.data.avatar"
        />
        <n-flex vertical justify="space-between">
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
          <n-flex align="end">
            <n-button ghost type="primary" @click="mutateInfo">
              Update User Info
            </n-button>
          </n-flex>
        </n-flex>
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

interface IResult {
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

const message = useMessage();

const testService = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: "fsl082618",
          name: "Flame",
          avatar: "https://i.meee.com.tw/Ji2PRvi.jpg",
          sex: "male",
          age: 24,
        },
      });
    }, 1000);
  });
};

const {
  run: getUserInfo,
  data,
  mutate,
  error,
  isLoading,
} = useRequest(testService, {
  manual: true,
});

getUserInfo();

const mutateInfo = () => {
  const random = Math.random() > 0.5 ? "female" : "male";
  mutate((data) => {
    data.data = {
      id: faker.string.uuid(),
      name: faker.person.fullName({
        sex: random,
      }),
      avatar: faker.image.personPortrait({
        sex: random,
        size: 256,
      }),
      sex: random,
      age: faker.number.int({
        min: 18,
        max: 35,
      }),
    };
  });
};
</script>
```

:::

## 乐观更新

在需要提升用户体验的场景下，可以在发送请求之前就立即更新 UI。如果请求失败，可以回滚数据：

:::demo

```vue
<template>
  <section>
    <n-spin :show="isLoading">
      <div v-if="data">
        <n-thing>
          <template #header>
            <h3>{{ data.data.title }}</h3>
          </template>
          <template #description>
            <n-text depth="3">{{ data.data.description }}</n-text>
          </template>
          <template #footer>
            <n-space align="center">
              <n-button
                :type="data.data.liked ? 'primary' : 'default'"
                @click="handleLike"
              >
                <template #icon>
                  <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                    <path
                      :fill="data.data.liked ? '#ff4757' : 'currentColor'"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </template>
                {{ data.data.liked ? "已点赞" : "点赞" }}
              </n-button>
              <n-text>{{ data.data.likes }} 人点赞</n-text>
            </n-space>
          </template>
        </n-thing>
      </div>
      <n-empty v-else description="暂无数据" />
    </n-spin>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import {
  NSpin,
  NEmpty,
  NThing,
  NText,
  NSpace,
  NButton,
  NAlert,
  useMessage,
} from "naive-ui";

interface IResult {
  code: number;
  msg: string;
  data: {
    title: string;
    description: string;
    likes: number;
    liked: boolean;
  };
}

const message = useMessage();

// 获取数据
const getArticle = (): Promise<IResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          title: "Vue3Request",
          description: "小而美的Vue3异步处理解决方案",
          likes: 42,
          liked: false,
        },
      });
    }, 1000);
  });
};

// 模拟点赞请求
const likeRequest = (liked: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
      if (Math.random() > 0.5) {
        resolve();
      } else {
        reject(new Error("网络错误，请重试"));
      }
    }, 1000);
  });
};

const { data, isLoading, mutate } = useRequest(getArticle);

const handleLike = async () => {
  // 保存原始数据用于回滚
  const originalData = JSON.parse(JSON.stringify(data.value));
  const newLiked = !data.value.data.liked;
  const likeDelta = newLiked ? 1 : -1;

  // 乐观更新：立即更新 UI
  mutate((data) => {
    data.data.liked = newLiked;
    data.data.likes = data.data.likes + likeDelta;
  });

  try {
    // 发送实际请求
    await runAsync(newLiked);
    message.success(newLiked ? "点赞成功！" : "取消点赞成功！");
  } catch (err) {
    // 请求失败，回滚数据
    mutate(originalData);
    message.error("操作失败，请重试");
  }
};

const { runAsync } = useRequest(likeRequest, {
  manual: true,
});
</script>
```

:::

## 备注

`mutate` 方法在以下场景中特别有用：

- **🎯 乐观更新**：提升用户体验，先更新 UI 再发送请求
- **📝 表单处理**：实时更新表单数据状态
- **🔧 本地操作**：无需请求的纯前端数据变更
- **⚡ 快速反馈**：用户操作的即时响应
