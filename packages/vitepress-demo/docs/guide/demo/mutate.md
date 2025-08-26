# 数据更改

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
    <n-spin :show="loading">
      <n-flex v-if="data">
        <n-image
          width="128"
          height="128"
          show-toolbar-tooltip
          :src="data.data.avatar"
        />
        <n-flex vertical justify="space-between">
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
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: "fsl082618",
          name: "Flame",
          email: "flame@example.com",
          avatar: "https://i.meee.com.tw/Ji2PRvi.jpg",
          department: "技术部",
          roles: "admin",
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
  loading,
} = useRequest(service, {
  manual: true,
});

getUserInfo();

const mutateInfo = () => {
  const gender = Math.random() > 0.5 ? "female" : "male";
  mutate((data) => {
    data.data = {
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
    <n-spin :show="loading">
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
      <n-empty v-else />
    </n-spin>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "vue3-request";
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

const { data, loading, mutate } = useRequest(getArticle);

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

## Result

| 参数   | 说明                       | 类型                                                                  |
| ------ | -------------------------- | --------------------------------------------------------------------- |
| mutate | 直接修改`data` | `(data: D \| ((data: D) => D)) => void` |
