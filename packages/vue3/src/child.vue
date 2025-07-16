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
import { useAsyncHandler, } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { reactive, ref } from "vue";
// axios
const axiosInstance = axios.create({
  // ...
});

axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以

// 模拟请求示例
const testService = (params: { age: number }, signal?: AbortSignal): Promise<{
  code: number;
  msg: string;
  data: number;
  request_id: string;
}> => {
  console.log('params', params)
  console.log('testService')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'success',
        data: Date.now(),
        request_id: '123'
      })
    }, 4000)
  })
};
// const composeMiddleware = (middlewares: any[], service: any) => {
//   let next = service
//   for (let i = middlewares.length; i-- > 0;) {
//     const middleware = middlewares[i]
//     next = middleware(next)
//   }
//   return next
// }

// const fun1 = (next: any) => {
//   console.log(1)
//   return next
// }
// const fun2 = (next: any) => {
//   console.log(2)
//   return next
// }
// const t = () => {
//   return 'tttttt'
// }

// const service = composeMiddleware([fun1, fun2], t)
// console.log(777, service())
const { data, error, isLoading, isFinished, isAborted, run, abort, cancel } = useAsyncHandler((signal) => () => testService({ age: 17 }, signal), {
  cacheKey: 'test',
  manual: true,
  onSuccess: (data, params) => {
    console.log('onSuccess', data, params)
  },
  onFinally: (params, data, error) => {
  }
}
)


const request = async () => {
  run()
}

</script>
