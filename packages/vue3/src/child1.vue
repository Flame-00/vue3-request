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
import { useRequest, definePlugin } from "@async-handler/request/vue3-request";
// import { useRequest, definePlugin, type Options } from "vue-request";
import { NSpin } from "naive-ui";


// 模拟请求示例
const service = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        reject(new Error('模拟请求失败'));
      } else {
        resolve(Date.now());
      }
    }, 500);
  });
};

// 定义插件选项类型
interface LogOptions {
  logLevel?: "info" | "warn" | "error";
  logPrefix?: string;
}

const plugin = definePlugin<number, [], LogOptions>(
  (requestInstance, options) => {
    const { logLevel = "info", logPrefix = "[Request]" } = options;
    const log = (level: keyof Console, message: string, timestamp?: number) => {
      console[level as keyof Console](`${logPrefix} ${message} ${timestamp}`);
    };

    return {
      onBefore: (params) => {
        log(logLevel, "请求开始", Date.now());
      },

      onRequest: (service) => {
        const startTime = Date.now();

        return async () => {
          try {
            const result = await service();
            const duration = Date.now() - startTime;
            log(logLevel, "请求成功", duration);
            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            log("error", "请求失败", duration);
            throw error;
          }
        };
      },

      onCancel: () => {
        log("warn", "请求被取消");
      },
    };
  }
);

const { data, error, params, run, loading, cancel } = useRequest(service, {
  manual: true,
  cacheKey: 'test',
  staleTime: 3000,
  setCache: (cacheKey, cacheData) => {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  },
  getCache: (cacheKey) => {
    return JSON.parse(localStorage.getItem(cacheKey) || '{}')
  },
  logLevel: 'info',
  logPrefix: '[Request]'
}, [plugin])

const request = async () => {
  run()
}



</script>