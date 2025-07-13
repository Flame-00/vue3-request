<template>
  <section>
    <h3>模拟请求</h3>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data }}</pre>
    <pre v-if="error">{{ error }}</pre>
    <pre v-if="isFinished">{{ isFinished }}</pre>
    <pre v-if="isAborted">{{ isAborted }}</pre>

    <button @click="request">请求</button>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request";

// 模拟请求示例
const testService = ({ name }: { name: string }): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  console.log('name', name)
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "数据请求成功",
        data: name,
        request_id: "278c3c4d23e30b38a11df8ed",
      });
    }, 2000);
  });
};
const { data, error, isLoading, isFinished, isAborted, runAsync } = useAsyncHandler(() => testService, {
  manual: true
});

const request = async () => {
  const res = await runAsync({ name: 'zs' })
  console.log('data', res)
}

</script>
