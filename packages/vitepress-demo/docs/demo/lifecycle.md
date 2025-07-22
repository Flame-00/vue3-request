# 生命周期

`useRequest` 提供了以下几个生命周期配置项，供你在异步函数的不同阶段做一些处理。

- `onBefore`：请求之前触发
- `onSuccess`：请求成功触发
- `onError`：请求失败触发
- `onFinally`：请求完成触发

:::demo

```vue
<template>
  <Button type="primary" @click="getUserInfo">获取用户信息</Button>
  <section>
    <Loading v-if="isLoading" />
    <div v-else-if="isFinished && data">
      <h3>
        id: {{ data.data.id }}<br />
        name: {{ data.data.name }}<br />
        age: {{ data.data.age }}<br />
        sex: {{ data.data.sex }}<br />
        avatar: <img width="256" height="256" :src="data.data.avatar" /><br />
        token: {{ data.data.token }}
      </h3>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import message from "@/utils/message";
import mock from "@/utils/faker";

interface IName {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    avatar: string;
    age: number;
    sex: string;
    token: string;
  };
}

const testService = (): Promise<IName> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: mock.string.uuid(),
          name: mock.person.fullName({ sex: "female" }),
          avatar: mock.image.personPortrait({ sex: "female", size: 256 }),
          sex: "女",
          age: mock.number.int({
            min: 18,
            max: 35,
          }),
          token: mock.string.nanoid({ min: 37, max: 37 }),
        },
      });
    }, 1000);
  });
};

const {
  run: getUserInfo,
  data,
  error,
  isLoading,
  isFinished,
} = useRequest(testService, {
  manual: true,
  onBefore: (params) => {
    message.info(`onBefore ${params}`);
  },
  onSuccess: (data, params) => {
    message.success(`onSuccess ${params}`);
  },
  onError: (error, params) => {
    message.error(`onError ${params}`);
  },
  onFinally: (params, data, error) => {
    message.info(`onFinally ${params}`);
  },
});
</script>
```

:::
