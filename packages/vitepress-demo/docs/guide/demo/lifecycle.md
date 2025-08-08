# 生命周期

`useRequest` 提供了完整的请求生命周期管理，让你可以在请求的不同阶段执行相应的业务逻辑，实现更精细化的控制和用户体验优化。

- 🚀 **onBefore** - 请求发起之前
- ✅ **onSuccess** - 请求成功完成时
- ❌ **onError** - 请求失败或抛出异常时
- 🏁 **onFinally** - 请求完成时（无论成功或失败）

以下 Demo 演示了完整的用户信息获取流程，展示各个生命周期的使用场景：

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
    const random = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: {
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
  isLoading,
} = useRequest(testService, {
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
