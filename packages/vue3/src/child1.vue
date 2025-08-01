<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <h2>{{ data }}</h2>
    <h2>{{ error?.message }}</h2>
    <h2>{{ params }}</h2>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
// import { useRequest } from "vue-request";
import axios from "axios";
import { reactive, ref } from "vue";
import { useMessage } from "naive-ui";
const message = useMessage()
// axios
const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以

const form = reactive({
  age: 18
})

// 模拟请求示例
const testService1 = (form: { age: number }): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: Math.random(),
        });
      } else {
        reject(new Error("模拟接口错误"));
      }
    }, 1000);
  });
};



const { data, error, params, run } = useRequest(() => testService1(form), {
  refreshOnWindowFocus: true,
  refocusTimespan: 1000,
  onSuccess: (data, params) => {
    console.log('onSuccess->child1', data, params)
    message.success('请求成功')
  },
  onError: (error, params) => {
    console.log('onError->child1', error, params)
    message.error('请求失败')
  },
})
useRequest(() => testService1(form), {
  refreshOnWindowFocus: true,
  refocusTimespan: 1000,
  onSuccess: (data, params) => {
    console.log('onSuccess->child1', data, params)
    message.success('请求成功')
  },
  onError: (error, params) => {
    console.log('onError->child1', error, params)
    message.error('请求失败')
  },
})


const request = async () => {
  run()
}

</script>