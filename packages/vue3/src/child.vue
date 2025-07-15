<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <button @click="abort">中止</button>
    <button @click="cancel">取消</button>
    <Loading v-if="isLoading" />
    <h2 v-if="data">{{ data }}</h2>
    <h3 v-if="error">{{ error }}</h3>
    <h3>isFinished: 已完成<em>{{ isFinished }}</em></h3>
    <h3>isAborted: 中止<em>{{ isAborted }}</em></h3>
    <h3>isLoading: 加载中<em>{{ isLoading }}</em></h3>

  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler, type Plugin } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { reactive, ref } from "vue";
// axios
const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以

// 模拟请求示例
const testService = (signal?: AbortSignal): Promise<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> => {
  // return axiosInstance.get('https://v2.xxapi.cn/api/aiqinggongyu', {
  //   signal
  // })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('test'))
    }, 1000)
  })
};

const customPlugin: Plugin<{
  code: number;
  msg: string;
  data: string;
  request_id: string;
}> = (requestInstance, options) => {

  return {
    onBefore: (params) => {
      console.log('customPlugin-onBefore', params)
    },
    onSuccess: (data, params) => {
      // console.log('onSuccess', data, params)
    }
  }
}

const { data, error, isLoading, isFinished, isAborted, run, abort, cancel } = useAsyncHandler((signal) => () => testService(signal), {
  manual: true,
  onSuccess: (data, params) => {
    console.log('onSuccess', data, params)
  },
  onFinally: (params, data, error) => {
    console.log('onFinally', params, data, error)
  }
}
)


const request = async () => {
  run()
}

</script>
