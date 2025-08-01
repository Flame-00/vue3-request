<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <h2>{{ data }}</h2>
    <h2>{{ error?.message }}</h2>
    <h2>{{ params }}</h2>



    <!-- <button @click="pollingInterval = 1000">1000</button>
    <button @click="pollingInterval = 3000">3000</button>
    <button @click="pollingInterval = 5000">5000</button>
    <button @click="pollingWhenHidden = !pollingWhenHidden">切换</button> -->
    <!-- <button @click="userId++"> 修改userId{{ userId }} </button>
    <button @click="obj.age++"> 修改obj{{ obj.age }} </button> -->
  </section>
</template>
<script setup lang="ts">
import { useRequest, definePlugin } from "@async-handler/request/vue3-request";
import axios from "axios";
import { reactive, ref, watch } from "vue";
import { useMessage } from "naive-ui";
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
const plugin = definePlugin<number, [number]>((requestInstance, options) => {
  console.log('plugin')
  return {
    onBefore: (params) => {
      console.log('onBefore', params)
    }
  }
})
axiosInstance.interceptors.response.use((response) => response.data); // 响应拦截器，自己业务项目想怎么配置都可以
const instanceId = Math.random().toString(36).substr(2, 9);
// 模拟请求示例
const testService = (age: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(age);
    }, 700);
  });
};
const pollingInterval = ref(2000)
const pollingWhenHidden = ref(false)
// const userId = ref(1)
// const obj = reactive({ age: 13 })
// watch([userId, () => obj], (newVal, oldVal) => {
//   console.log(newVal, oldVal)
// }, { deep: true })
const { data, error, params, run } = useRequest(testService, {
  // pollingInterval,
  // pollingWhenHidden,
  // ready: () => props.
  // refreshDeps: [userId, () => obj],
  // refreshDepsAction() {
  //   console.log('refreshDepsAction')
  // },
  onSuccess: (data, params) => {
    message.success('请求成功')
  },
  onError: (error, params) => {
    message.error(instanceId)
  },
}, [
  plugin
])


const request = async () => {
  run(18)
}



</script>