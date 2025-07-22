# 刷新（重复上一次请求）

`useRequest` 提供了 `refresh` 和 `refreshAsync` 方法，使我们可以使用上一次的参数，重新发起请求。

假如在读取用户信息的场景中

1. 我们读取了 ID 为 1 的用户信息 `getUserInfo(1)`
2. 我们通过某种手段更新了用户信息
3. 我们想重新发起上一次的请求，那我们就可以使用 `refresh` 来代替 `getUserInfo(1)`，这在复杂参数的场景中是非常有用的

:::demo

```vue
<template>
  <Button type="primary" @click="refresh">refresh</Button>
  <section>
    <h3>params: {{ params }}</h3>
    <hr />
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

interface IUserInfo {
  code: number;
  msg: string;
  data: {
    id: number;
    name: string;
    avatar: string;
    age: number;
    token: string;
  };
}

const testService = (id: number): Promise<IUserInfo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id,
          name: mock.person.fullName({ sex: "female" }),
          avatar: mock.image.personPortrait({ sex: "female" }),
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
  refresh,
  data,
  params,
  error,
  isLoading,
  isFinished,
} = useRequest(testService);

getUserInfo(1);
</script>
```

:::
