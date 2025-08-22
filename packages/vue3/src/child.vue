<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <button @click="abort">abort</button>
    <NSpin :show="loading">
      <h2>data:{{ data }}</h2>
      <h2>error: {{ error?.message }}</h2>
      <h2>params: {{ params }}</h2>
    </NSpin>

  </section>
</template>
<script setup lang="ts">
import { useRequest, definePlugin } from "@async-handler/request/vue3-request";
// import { useRequest } from "vue-request";
import axios from "axios";
import { reactive, ref, watch } from "vue";
import { useMessage, NSpin, } from "naive-ui";

const message = useMessage()
const axiosInstance = axios.create({
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以


function service(params: number): Promise<number> {
  console.log(signal.value)
  return axiosInstance.get("https://v2.xxapi.cn/api/aiqinggongyu", {
    signal: signal.value,
  });
};

const { data, error, params, run, signal, loading, abort, runAsync } = useRequest(service, {
  manual: true
})
run(456)
const request = async () => {
  // run(789)
  const res = await runAsync(789)
  console.log(res)
}



</script>