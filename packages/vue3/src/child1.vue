<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <NSpin :show="isLoading">
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
import { useMessage, NSpin } from "naive-ui";
const props = defineProps({
  ready: {
    type: Boolean,
    default: false,
  },
})
const message = useMessage()
// axios
const axiosInstance = axios.create({
  // ...
});
// const plugin = definePlugin<number, [number]>((requestInstance, options) => {
//   return {
//     onBefore: (params) => {
//       console.log('onBefore', params)
//     },
//     onMutate: (data) => {
//       console.log('onMutate', data)
//     },
//     onSuccess: (data, params) => {
//       console.log('onSuccess', data, params)
//     },
//     onError: (error, params) => {
//       console.log('onError', error, params)
//     }
//   }
// })
axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以
// 模拟请求示例
const testService = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Date.now());
    }, 1500);
  });
};
const pollingInterval = ref(1000)
const pollingWhenHidden = ref(false)
// const userId = ref(1)
// const obj = reactive({ age: 13 })
// watch([userId, () => obj], (newVal, oldVal) => {
//   console.log(newVal, oldVal)
// }, { deep: true })
const refreshOnWindowFocus = ref(false)
const refocusTimespan = ref(2500)
let age = ref(18)
const { data, error, params, run, refresh, mutate, isLoading } = useRequest(testService, {
  // pollingInterval,
  // pollingWhenHidden,
  // ready: () => props.ready,
  cacheKey: 'test',
  cacheTime: 1000,
  // staleTime: props.staleTime,
  // refreshDeps: [userId, () => obj],
  // refreshDepsAction() {
  //   console.log('refreshDepsAction')
  // },
  // refreshOnWindowFocus,
  // refocusTimespan,
  onSuccess: (data, params) => {
    console.log('onSuccess1', data, params)
    message.success('请求成功')
  },
  onError: (error, params) => {
  },
})

const request = async () => {
  refresh()
  // age.value++
  // run({ age: age.value })
}

const mutateData = () => {
  mutate(oldData => oldData + 1)
}



</script>