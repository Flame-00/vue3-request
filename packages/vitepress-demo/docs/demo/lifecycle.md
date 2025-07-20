# 生命周期

`useRequest` 提供了以下几个生命周期配置项，供你在异步函数的不同阶段做一些处理。

- `onBefore`：请求之前触发
- `onSuccess`：请求成功触发
- `onError`：请求失败触发
- `onFinally`：请求完成触发

:::demo

```vue
<template>
  <input id="ipt" type="text" placeholder="输入姓氏" v-model="xing" />
  <Button type="primary" @click="() => run(xing)">生成姓名</Button>
  <section>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data.data ?? data.msg }}</pre>
    <pre id="error" v-if="error">{{ error }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import axios from "axios";
import { ref } from "vue";
import message from "@/utils/message";
import delay from "@/utils/delay";

const xing = ref("范");

interface IName {
  data: {
    code: number;
    msg: string;
    data: string[];
  };
}

const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以

const testService = async (xing: string): Promise<IName> => {
  if (Math.random() > 0.5) {
    // 模拟50%的几率出错
    await delay(1000); // 延时函数
    return Promise.reject(new Error("接口错误"));
  }
  return axiosInstance.get(
    "https://api.pearktrue.cn/api/name/generate?sex=all&count=5",
    {
      params: {
        xing,
      },
    }
  );
};

const { run, data, error, isLoading } = useRequest(() => testService, {
  manual: true,
  onBefore: (params) => {
    message.info(`Start Request: ${params}`);
  },
  onSuccess: (data, params) => {
    message.success(`The xing was changed to "${params}"`);
  },
  onError: (error, params) => {
    message.error(`${error}-----${params}`);
  },
  onFinally: (params, data, error) => {
    message.info(`Request finish`, params, data, error);
  },
});
</script>
```

:::
