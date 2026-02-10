# 屏幕聚焦重新请求

通过设置 `options.refreshOnWindowFocus` 参数，`useRequest` 会在浏览器窗口重新获得焦点或可见时重新请求。这个功能在用户切换标签页或应用程序后返回时，能确保显示最新的数据。

## 基础用法

```ts
const { data, loading } = useRequest(getUserInfo, {
  refreshOnWindowFocus: true, // 窗口聚焦时刷新 [!code ++]
  refocusTimespan: 2000, // 聚焦刷新的时间间隔 [!code ++]
});
```

:::demo

```vue
<template>
  <section>
    <n-alert :showIcon="false" type="info" style="margin-bottom: 16px">
      💡尝试切换到其他标签页或最小化浏览器窗口，然后再回到当前页面，如果和上一次请求间隔大于
      {{ refocusTimespan }}ms，则会重新请求一次。
    </n-alert>
    <n-flex vertical>
      <n-flex align="center">
        <span>重新聚焦间隔:</span>
        <n-input-number
          v-model:value="refocusTimespan"
          :min="1000"
          :step="1000"
        />
      </n-flex>
      <n-flex align="center">
        <span>窗口聚焦时是否自动刷新:</span>
        <n-switch :round="false" v-model:value="refreshOnWindowFocus" />
        {{ refreshOnWindowFocus }}
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
              <n-flex>
                <n-text italic>最后更新:</n-text>
                <n-text :depth="3">{{
                  new Date(data.data.lastUpdate).toLocaleTimeString()
                }}</n-text>
              </n-flex>
            </div>
          </n-flex>
        </div>
        <n-empty v-else size="huge" />
      </n-spin>
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "vue3-request";
import { ref } from "vue";
import {
  NSpin,
  NEmpty,
  NFlex,
  NText,
  NImage,
  NAlert,
  NSwitch,
  NInputNumber,
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
    lastUpdate: number;
  };
}

const refocusTimespan = ref(2000);
const refreshOnWindowFocus = ref(true);

const getUserInfo = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
          lastUpdate: Date.now(),
        },
      });
    }, 800);
  });
};

const { data, error, loading } = useRequest(getUserInfo, {
  refreshOnWindowFocus, // [!code highlight]
  refocusTimespan, // [!code highlight]
});
</script>
```

:::

## Options

| 参数                 | 说明                       | 类型                      | 默认值  |
| -------------------- | -------------------------- | ------------------------- | ------- |
| [refreshOnWindowFocus](/API/#refreshonwindowfocus) | 窗口聚焦时是否自动刷新     | `boolean \| Ref<boolean>` | `false` |
| [refocusTimespan](/API/#refocustimespan)      | 重新聚焦时间间隔，（毫秒） | `number \| Ref<number>`   | `5000`  |

## 贡献者 :shamrock:

<Team />