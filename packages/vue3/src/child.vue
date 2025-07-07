<template>
    <section>
      <h3>模拟请求</h3>
      <!-- <Loading v-if="isLoading" /> -->
      <pre>{{ data }}</pre>
      <pre>{{ error }}</pre>
    </section>
    <hr />
    <section>
      <h3>axios</h3>
      <!-- <Loading v-if="isLoadingAxios" /> -->
      <pre>{{ dataAxios?.data }}</pre>
      <pre>{{ errorAxios }}</pre>
    </section>
    <hr />
    <section>
      <h3>fetch</h3>
      <!-- <Loading v-if="isLoadingFetch" /> -->
      <pre>{{ dataFetch }}</pre>
      <pre>{{ errorFetch }}</pre>
    </section>
  </template>
  <script setup lang="ts">
  import { useAsyncHandler } from "@flame00/vue3-async-handler";
  import axios from "axios";
  
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
  
  // 请求接口示例
  const url1 = "https://v2.xxapi.cn/api/renjian";
  const url2 = "https://v2.xxapi.cn/api/aiqinggongyu";
  
  // axios
  const configAxios = {
    method: "GET",
    url: url1,
  };
  
  const testServiceAxios = (): Promise<{
    code: number;
    msg: string;
    data: string;
    request_id: string;
  }> => {
    return axios(configAxios);
  };
  
  const {
    data: dataAxios,
    error: errorAxios,
    isLoading: isLoadingAxios,
  } = useAsyncHandler(() => testServiceAxios);
  
  // fetch
  const configFetch = {
    method: "GET",
  };
  
  const testServiceFetch = (): Promise<{
    code: number;
    msg: string;
    data: string;
    request_id: string;
  }> => {
    // fetch需处理返回格式
    return fetch(url2, configFetch).then((response) => response.json());
  };
  
  const {
    data: dataFetch,
    error: errorFetch,
    isLoading: isLoadingFetch,
  } = useAsyncHandler(() => testServiceFetch);
  </script>