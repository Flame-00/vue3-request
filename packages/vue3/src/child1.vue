<template>
  <section>
    <h3>模拟请求</h3>
    <button @click="request">请求</button>
    <button @click="cancel">取消</button>
    <NSpin :show="loading">
      <h2>data:{{ data }}</h2>
      <h2>error: {{ error?.message }}</h2>
      <h2>params: {{ params }}</h2>
    </NSpin>

  </section>
</template>
<script setup lang="ts">
import { useRequest, definePlugin } from "vue3-request";
import { NSpin } from "naive-ui";

interface IResult {
  code: number;
  msg: string;
  data: {
    name: string;
    age: number;
  };
}

const service = ({ id }: { id: number }): Promise<IResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          name: "zs",
          age: 24,
        },
      });
    }, 1000);
  });
};

interface IPlugin {
  level: string
}

const customPlugin = definePlugin<IResult, [{ id: number }], IPlugin>(
  (requestInstance, options) => {
    // 插件初始化逻辑
  
    return {
      onBefore: (params) => {
        // 请求前执行
      },
      onRequest: (service) => {
        // 请求时执行，可以修改 service
        return service;
      },
      onSuccess: (data, params) => {
        // 请求成功时执行
      },
      onError: (error, params) => {
        // 请求失败时执行
      },
      onFinally: (params, data, error) => {
        // 请求完成时执行（无论成功或失败）
      },
      onCancel: () => {
        // 请求取消时执行
      },
      onMutate: (data) => {
        // 数据变更时执行
      },
    };
  }
);
const { data, loading, cancel, params, error, run } = useRequest(
  service,
  {
    level: '1',
    manual: true,
    // options
  },
  [customPlugin]// [!code ++]
);

const request = () => {
  run({ id: 1 });
};

</script>