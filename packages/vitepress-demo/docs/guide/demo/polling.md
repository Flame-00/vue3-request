# 轮询

设置 `options.pollingInterval` 选项，`useRequest` 会定期重新执行请求，实现数据的自动刷新功能，让你的应用保持数据同步。

- **自动轮询**：轮询会在第一次请求完成后开始计时
- **智能清理**：组件卸载时会自动停止轮询
- **响应式配置**：支持响应式的轮询间隔设置

## 基本用法

```ts
const { data, isLoading } = useRequest(getUserInfo, {
  pollingInterval: 2000, // 每2秒轮询一次 [!code ++]
});
```

## 页面隐藏时的轮询控制

通过 `options.pollingWhenHidden` 选项，你可以控制当页面隐藏时是否继续轮询。这对于优化性能和节省资源非常有用。

```ts
const { data, isLoading } = useRequest(getUserInfo, {
  pollingInterval: 2000,
  pollingWhenHidden: false, // 页面隐藏时暂停轮询 [!code ++]
});
```

以下示例模拟实时获取系统状态：

:::demo

```vue
<template>
  <section>
    <n-spin :show="isLoading && !data && !error">
      <n-alert type="info" v-if="!pollingWhenHidden">
        尝试切换到其他标签页或最小化浏览器窗口，观察轮询行为的变化
      </n-alert>
      <div v-if="data" class="status-info">
        <n-tag :type="data.status === 'online' ? 'success' : 'error'">
          {{ data.status === "online" ? "在线" : "离线" }}
        </n-tag>
        <p><strong>CPU使用率:</strong> {{ data.cpu }}%</p>
        <p><strong>内存使用率:</strong> {{ data.memory }}%</p>
        <p><strong>最后更新:</strong> {{ data.timestamp }}</p>
        <p><strong>轮询次数:</strong> {{ data.count }}</p>
      </div>
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <n-empty v-else description="正在获取系统状态..."> </n-empty>
    </n-spin>
    <n-flex vertical>
      <n-flex align="center">
        <span>pollingInterval:</span>
        <n-input-number
          v-model:value="pollingInterval"
          :min="500"
          :step="500"
        />
      </n-flex>
      <n-flex align="center">
        <span>pollingWhenHidden:</span>
        <n-switch :round="false" v-model:value="pollingWhenHidden" />
        {{ pollingWhenHidden }}
      </n-flex>
    </n-flex>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRequest } from "@async-handler/request/vue3-request";
import {
  NSpin,
  NEmpty,
  NText,
  NTag,
  NInputNumber,
  NFlex,
  NSwitch,
  NAlert,
} from "naive-ui";

interface SystemStatus {
  status: "online" | "offline";
  cpu: number;
  memory: number;
  timestamp: string;
  count: number;
}

let pollCount = 0;

const getSystemStatus = (): Promise<SystemStatus> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      pollCount++;
      const isOnline = Math.random() > 0.2;

      resolve({
        status: isOnline ? "online" : "offline",
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        timestamp: new Date().toLocaleTimeString(),
        count: pollCount,
      });
    }, 500);
  });
};

const pollingInterval = ref(2000);
const pollingWhenHidden = ref(true);
const { data, error, isLoading } = useRequest(getSystemStatus, {
  pollingInterval,
  pollingWhenHidden,
});
</script>
<style scoped>
.status-info {
  margin-top: 15px;
}
.status-info p {
  margin: 8px 0;
}
</style>
```

:::
