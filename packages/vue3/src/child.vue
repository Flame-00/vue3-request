<template>
  <section>
    <h3>模拟请求</h3>
    <Loading v-if="isLoading" />
    <pre v-if="data">{{ data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
  <hr />
  <section>
    <h3>axios</h3>
    <Loading v-if="isLoadingAxios" />
    <pre v-if="dataAxios">{{ dataAxios.data }}</pre>
    <div>{{ a }}</div>
    <pre v-if="errorAxios">{{ errorAxios }}</pre>
  </section>
  <hr />
  <section>
    <h3>fetch</h3>
    <Loading v-if="isLoadingFetch" />
    <pre v-if="dataFetch">{{ dataFetch }}</pre>
    <pre v-if="errorFetch">{{ errorFetch }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@flame00/vue3-async-handler";
import { ref, shallowRef } from "vue";
import axios from "axios";

const a = shallowRef(123)
// 模拟请求示例
const testService = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return new Promise((resolve) => {
    console.log("testService");
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "数据请求成功",
        data: "我是假数据",
        request_id: "278c3c4d23e30b38a11df8ed",
      });
    }, 2500);
  });
};
const { run, data, error, isLoading } = useAsyncHandler(() => testService);

// axios
const testServiceAxios = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  return axios.get("https://v2.xxapi.cn/api/renjian");
};
const {
  data: dataAxios,
  error: errorAxios,
  isLoading: isLoadingAxios,
} = useAsyncHandler(() => testServiceAxios);

// fetch
const testServiceFetch = (): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  // fetch需处理返回格式
  return fetch("https://v2.xxapi.cn/api/aiqinggongyu", {
    method: "GET",
  }).then((response) => response.json());
};
const {
  data: dataFetch,
  error: errorFetch,
  isLoading: isLoadingFetch,
} = useAsyncHandler(() => testServiceFetch);
</script>
