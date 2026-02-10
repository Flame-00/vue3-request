<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="run">run</button>
    <button @click="abort">abort</button>
    <button @click="newMutate">mutate</button>
    <NSpin :show="loading">
      <h2>data:{{ data }}</h2>
      <h2>res :{{ res }}</h2>
      <h2>error: {{ error?.message }}</h2>
      <h2>params: {{ params }}</h2>
    </NSpin>
  </section>
</template>
<script setup lang="ts">
import { useRequest, definePlugin } from "vue3-request";
import { NSpin } from "naive-ui";

const { data, res, error, params, run, loading, abort } = useRequest(service, {
  onSuccess: (params) => {
    console.log(111, res.value);
  },
  onError: () => {
    console.log(222, error.value);
  },
});
function service(): Promise<{
  code: number;
  data: {
    name: string;
    age: number;
  }[];
}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 123,
        data: [
          { name: "张三", age: 18 },
          { name: "李四", age: 20 },
          { name: "王五", age: 22 },
        ],
      });
    }, 1000);
  });
}

function newMutate() {
  // mutate((data) => {
  //   console.log(111, data);
  //   return {
  //     ...data,
  //     count: 100,
  //     data: {
  //       ...data.data,
  //       title: "new Flame",
  //     },
  //   };
  // });
}
</script>
