<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <NSpin :show="loading">
      <h2>data:{{ data }}</h2>
      <h2>error: {{ error?.message }}</h2>
      <h2>params: {{ params }}</h2>
    </NSpin>

  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { NSpin } from "naive-ui";


// 模拟请求示例
const service = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Date.now());
    }, 1500);
  });
};

const { data, error, params, run, loading } = useRequest(service, {
  manual: true,
  cacheKey: 'test',
  staleTime: 3000,
  setCache: (cacheKey, cacheData) => {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  },
  getCache: (cacheKey) => {
    return JSON.parse(localStorage.getItem(cacheKey) || '{}')
  }
})

const request = async () => {
  run()
}



</script>