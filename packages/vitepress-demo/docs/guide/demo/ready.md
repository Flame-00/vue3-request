# 依赖请求

通过设置 `ready` 参数控制请求执行时机，实现条件请求和依赖管理。

`ready` 支持两种类型：

- `Ref<boolean>`
- `() => boolean`（getter 函数）

```ts
const isLoggedIn = ref(false);
const { data } = useRequest(fetchUser, {
  ready: isLoggedIn, // 登录后才请求 [!code ++]
});

// 或使用 getter
const props = defineProps<{ userId: number | string }>();
const { data } = useRequest(fetchUser, {
  ready: () => props.userId, // 有用户ID时才请求 [!code ++]
});
```

## 自动模式

在自动模式下，当 `ready` 从 `false` 变为 `true` 时，会自动发起请求：

:::demo

```vue
<template>
  <section>
    <n-switch :rail-style="railStyle" v-model:value="isLoggedIn">
      <template #checked>log out</template>
      <template #unchecked>Click to log in</template>
    </n-switch>
    <hr />
    <n-spin :show="loading">
      <n-flex :wrap="false" v-if="data">
        <n-image show-toolbar-tooltip :src="data.data.avatar" />
        <div>
          <n-flex>
            <n-text italic>姓名:</n-text>
            <n-text depth="3">{{ data.data.name }}</n-text>
          </n-flex>
          <n-flex>
            <n-text italic>邮箱:</n-text>
            <n-text depth="3">{{ data.data.email }}</n-text>
          </n-flex>
          <n-flex>
            <n-text italic>部门:</n-text>
            <n-text depth="3">{{ data.data.department }}</n-text>
          </n-flex>

          <n-flex>
            <n-text italic>身份:</n-text>
            <n-text depth="3">{{ data.data.roles }}</n-text>
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
import { ref, watch } from "vue";
import { NSpin, NSwitch, NEmpty, NFlex, NText, NImage } from "naive-ui";
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

const isLoggedIn = ref(false);

const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#d03050";
  }
  return style;
};

const service = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    const gender = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
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
    }, 1000);
  });
};

// 自动模式：ready 变为 true 时自动请求
const { data, error, loading, mutate } = useRequest(service, {
  ready: isLoggedIn, // [!code highlight]
});

// 监听登录状态，登出时清空数据
watch(isLoggedIn, (newValue) => {
  if (!newValue) {
    mutate(undefined);
  }
});
</script>
```

:::

## 手动模式

在手动模式下，即使 `ready` 为 `true`，也需要手动调用 `run` 才能执行。但如果 `ready` 为 `false`，则无法执行请求。

以下示例展示了手动模式下的用户信息获取：

:::demo

```vue
<template>
  <section>
    <n-flex align="center">
      <n-switch :rail-style="railStyle" v-model:value="isLoggedIn">
        <template #checked>log out</template>
        <template #unchecked>Click to log in</template>
      </n-switch>
      <n-button type="primary" @click="getUserInfo" :disabled="!isLoggedIn">
        Obtain user information
      </n-button>
    </n-flex>
    <hr />
    <n-spin :show="loading">
      <n-flex :wrap="false" v-if="data">
        <n-image show-toolbar-tooltip :src="data.data.avatar" />
        <div>
          <n-flex>
            <n-text italic>姓名:</n-text>
            <n-text depth="3">{{ data.data.name }}</n-text>
          </n-flex>
          <n-flex>
            <n-text italic>邮箱:</n-text>
            <n-text depth="3">{{ data.data.email }}</n-text>
          </n-flex>
          <n-flex>
            <n-text italic>部门:</n-text>
            <n-text depth="3">{{ data.data.department }}</n-text>
          </n-flex>

          <n-flex>
            <n-text italic>身份:</n-text>
            <n-text depth="3">{{ data.data.roles }}</n-text>
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
import { ref, watch } from "vue";
import {
  NSpin,
  NButton,
  NSwitch,
  NEmpty,
  NFlex,
  NText,
  NImage,
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

const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#d03050";
  }
  return style;
};

const isLoggedIn = ref(false);

const service = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    const gender = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
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
    }, 1000);
  });
};

const {
  data,
  error,
  loading,
  run: getUserInfo,
  mutate,
} = useRequest(service, {
  manual: true,
  ready: isLoggedIn, // [!code highlight]
});

watch(isLoggedIn, (newValue) => {
  if (!newValue) {
    mutate(undefined);
  }
});
</script>
```

:::

## Options

| 参数  | 说明                 | 类型                            | 默认值 |
| ----- | -------------------- | ------------------------------- | ------ |
| ready | 当前请求是否准备好了 | `Ref<boolean> \| () => boolean` | `true` |
