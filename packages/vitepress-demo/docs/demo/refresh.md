# 刷新（重复上一次请求）

`useAsyncHandler` 提供了 `refresh` 和 `refreshAsync` 方法，使我们可以使用上一次的参数，重新发起请求。

假如在生成姓名的场景中

我们生成了 姓氏 为 林 的姓名数组 `run('林')`
我们通过某种手段更新了姓名数组
我们想重新发起上一次的请求，那我们就可以使用 `refresh `来代替 `run('林')`，这在复杂参数的场景中是非常有用的

:::demo

```vue
<template>
  <Button type="primary" @click="refresh">刷新</Button>
  <section>
    <Loading v-if="isLoading" />
    <p v-if="params">{{ params }}</p>
    <pre v-if="data">{{ data?.data.data }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { onMounted } from "vue";
import message from "@/utils/message";

interface IName {
  data: {
    code: number;
    msg: string;
    data: string[];
  };
}

const testService = (xing: string): Promise<IName> => {
  console.log("use-request-refresh-xing", xing);
  return axios.get(
    "https://api.pearktrue.cn/api/name/generate?sex=all&count=5",
    {
      params: {
        xing,
      },
    }
  );
};

const { run, refresh, data, params, error, isLoading } = useAsyncHandler(
  () => testService,
  {
    manual: true,
    onFinally: (params, data, error) => {
      message.info(`请求参数为-${JSON.stringify(params)}`);
    },
  }
);

onMounted(() => {
  run("林");
});
</script>
```

:::
