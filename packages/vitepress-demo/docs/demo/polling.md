# 轮询

通过设置 `options.pollingInterval` 选项，`useRequest` 会定期重新执行请求，实现数据的自动刷新功能，让你的应用保持数据同步。

## 基本用法

只需在 `useRequest` 的配置中设置 `pollingInterval` 参数（单位：毫秒），即可开启轮询功能：

```ts
const { data, isLoading } = useRequest(getUserInfo, {
  pollingInterval: 3000, // 每3秒轮询一次
});
```

### 核心特性

- **自动轮询**：轮询会在第一次请求完成后开始计时
- **智能清理**：组件卸载时会自动停止轮询
- **响应式配置**：支持响应式的轮询间隔设置

以下示例展示了基本的轮询功能，模拟实时获取系统状态：

:::demo

```vue
<template>
  <section>
    <n-card title="系统状态监控 (每2秒轮询)">
      <n-spin :show="isLoading && !data">
        <div v-if="data" class="status-info">
          <n-tag :type="data.status === 'online' ? 'success' : 'error'">
            {{ data.status === 'online' ? '在线' : '离线' }}
          </n-tag>
          <p><strong>CPU使用率:</strong> {{ data.cpu }}%</p>
          <p><strong>内存使用率:</strong> {{ data.memory }}%</p>
          <p><strong>最后更新:</strong> {{ data.timestamp }}</p>
          <p><strong>轮询次数:</strong> {{ data.count }}</p>
        </div>
        <n-empty v-else-if="!error" description="正在获取系统状态..."> </n-empty>
        <n-text type="error" v-if="error">{{ error.message }}</n-text>
      </n-spin>
    </n-card>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { NSpin, NEmpty, NCard, NText, NTag } from "naive-ui";

interface SystemStatus {
  status: 'online' | 'offline';
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
      // 模拟10%的几率系统离线
      const isOnline = Math.random() > 0.5;
      // 模拟5%的几率请求失败
      if (Math.random() < 0.05) {
        reject(new Error("网络连接失败"));
        return;
      }
      
      resolve({
        status: isOnline ? 'online' : 'offline',
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        timestamp: new Date().toLocaleTimeString(),
        count: pollCount
      });
    }, 500);
  });
};

const { data, error, isLoading } = useRequest(getSystemStatus, {
  pollingInterval: 2000, // 每2秒轮询一次
});
</script>
<style scoped>
.status-info p {
  margin: 8px 0;
}
</style>
```

:::

## 页面隐藏时的轮询控制

通过 `pollingWhenHidden` 选项，你可以控制当页面隐藏时是否继续轮询。这对于优化性能和节省资源非常有用。

```ts
const { data, isLoading } = useRequest(getUserInfo, {
  pollingInterval: 3000,
  pollingWhenHidden: false, // 页面隐藏时暂停轮询
});
```

### 配置说明

- **`pollingWhenHidden: true`** (默认)：页面隐藏时继续轮询
- **`pollingWhenHidden: false`**：页面隐藏时暂停轮询，页面重新显示时恢复

以下示例演示了页面可见性对轮询的影响：

:::demo

```vue
<template>
  <section>
    <n-card title="页面可见性轮询控制">
      <n-space vertical>
        <n-alert type="info">
          尝试切换到其他标签页或最小化浏览器窗口，观察轮询行为的变化
        </n-alert>
        <n-switch v-model:value="pollingWhenHidden">
          <template #checked>页面隐藏时继续轮询</template>
          <template #unchecked>页面隐藏时暂停轮询</template>
        </n-switch>
        <n-spin :show="isLoading && !data">
          <div v-if="data" class="visibility-info">
            <n-tag :type="data.isVisible ? 'success' : 'warning'">
              页面{{ data.isVisible ? '可见' : '隐藏' }}
            </n-tag>
            <p><strong>轮询计数:</strong> {{ data.count }}</p>
            <p><strong>最后更新:</strong> {{ data.timestamp }}</p>
            <p><strong>页面状态:</strong> {{ data.visibilityState }}</p>
          </div>
          <n-empty v-else description="正在获取数据..."> </n-empty>
        </n-spin>
      </n-space>
    </n-card>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import { NSpin, NEmpty, NCard, NSwitch, NSpace, NAlert, NTag } from "naive-ui";

interface VisibilityData {
  count: number;
  timestamp: string;
  isVisible: boolean;
  visibilityState: string;
}

const pollingWhenHidden = ref(true);
let visibilityCount = 0;

const getVisibilityStatus = (): Promise<VisibilityData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      visibilityCount++;
      resolve({
        count: visibilityCount,
        timestamp: new Date().toLocaleTimeString(),
        isVisible: !document.hidden,
        visibilityState: document.visibilityState
      });
    }, 300);
  });
};

const { data, isLoading } = useRequest(getVisibilityStatus, {
  pollingInterval: 1500, // 每1.5秒轮询一次
  pollingWhenHidden, // 响应式配置
});
</script>
<style scoped>
.visibility-info p {
  margin: 8px 0;
}
</style>
```

:::

## 错误重试与轮询

当轮询过程中遇到错误时，可以通过 `errorRetryCount` 配置错误重试次数。如果设置了重试次数，轮询会在出现错误时暂停，直到重试完成或成功后才会继续。

```ts
const { data, isLoading } = useRequest(getUserInfo, {
  pollingInterval: 3000,
  errorRetryCount: 3, // 错误时重试3次
  errorRetryInterval: 1000, // 重试间隔1秒
});
```

以下示例展示了轮询过程中的错误处理和重试机制：

:::demo

```vue
<template>
  <section>
    <n-card title="轮询错误重试机制">
      <n-space vertical>
        <n-flex>
          <n-input-number 
            v-model:value="errorRate" 
            :min="0" 
            :max="100"
            :step="10"
            placeholder="错误率"
          />
          <n-text>% 错误率</n-text>
        </n-flex>
        <n-spin :show="isLoading && !data">
          <div v-if="data" class="retry-info">
            <n-tag :type="data.success ? 'success' : 'error'">
              {{ data.success ? '请求成功' : '请求失败' }}
            </n-tag>
            <p><strong>尝试次数:</strong> {{ data.attempts }}</p>
            <p><strong>成功次数:</strong> {{ data.successCount }}</p>
            <p><strong>失败次数:</strong> {{ data.errorCount }}</p>
            <p><strong>最后更新:</strong> {{ data.timestamp }}</p>
          </div>
          <n-empty v-else description="正在获取数据..."> </n-empty>
          <n-text type="error" v-if="error">
            轮询暂停: {{ error.message }}
          </n-text>
        </n-spin>
      </n-space>
    </n-card>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import { 
  NSpin, 
  NEmpty, 
  NCard, 
  NSpace, 
  NFlex,
  NInputNumber, 
  NText,
  NTag 
} from "naive-ui";

interface RetryData {
  success: boolean;
  attempts: number;
  successCount: number;
  errorCount: number;
  timestamp: string;
}

const errorRate = ref(30); // 30% 错误率
let attempts = 0;
let successCount = 0;
let errorCount = 0;

const getDataWithRetry = (): Promise<RetryData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      attempts++;
      const shouldError = Math.random() * 100 < errorRate.value;
      
      if (shouldError) {
        errorCount++;
        reject(new Error(`模拟请求失败 (错误率: ${errorRate.value}%)`));
      } else {
        successCount++;
        resolve({
          success: true,
          attempts,
          successCount,
          errorCount,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 500);
  });
};

const { data, error, isLoading } = useRequest(getDataWithRetry, {
  pollingInterval: 2000, // 每2秒轮询
  errorRetryCount: 2, // 错误时重试2次
  errorRetryInterval: 1000, // 重试间隔1秒
  onError: (error) => {
    console.log('轮询遇到错误:', error.message);
  },
  onSuccess: () => {
    console.log('轮询请求成功');
  }
});
</script>
<style scoped>
.retry-info p {
  margin: 8px 0;
}
</style>
```

:::

## 动态轮询间隔

轮询间隔支持响应式配置，你可以根据业务需求动态调整轮询频率：

:::demo

```vue
<template>
  <section>
    <n-card title="动态轮询间隔">
      <n-space vertical>
        <n-flex align="center">
          <n-text>轮询间隔:</n-text>
          <n-slider 
            v-model:value="pollingInterval" 
            :min="1000" 
            :max="10000" 
            :step="500"
            style="width: 200px"
          />
          <n-text>{{ pollingInterval }}ms</n-text>
        </n-flex>
        <n-spin :show="isLoading && !data">
          <div v-if="data" class="dynamic-info">
            <n-progress 
              type="circle" 
              :percentage="data.progress"
              :color="data.progress === 100 ? '#18a058' : '#2080f0'"
            >
              {{ data.progress }}%
            </n-progress>
            <p><strong>当前间隔:</strong> {{ pollingInterval }}ms</p>
            <p><strong>轮询次数:</strong> {{ data.count }}</p>
            <p><strong>最后更新:</strong> {{ data.timestamp }}</p>
          </div>
          <n-empty v-else description="正在获取数据..."> </n-empty>
        </n-spin>
      </n-space>
    </n-card>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import { 
  NSpin, 
  NEmpty, 
  NCard, 
  NSpace, 
  NFlex,
  NSlider, 
  NText,
  NProgress 
} from "naive-ui";

interface DynamicData {
  progress: number;
  count: number;
  timestamp: string;
}

const pollingInterval = ref(3000); // 初始3秒间隔
let dynamicCount = 0;

const getDynamicData = (): Promise<DynamicData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      dynamicCount++;
      // 模拟进度，每次增加随机值
      const progress = Math.min(100, (dynamicCount * 7) % 101);
      
      resolve({
        progress,
        count: dynamicCount,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 300);
  });
};

const { data, isLoading } = useRequest(getDynamicData, {
  pollingInterval, // 响应式轮询间隔
  onSuccess: (data) => {
    console.log(`轮询成功，进度: ${data.progress}%`);
  }
});
</script>
<style scoped>
.dynamic-info {
  text-align: center;
}
.dynamic-info p {
  margin: 12px 0;
}
</style>
```

:::

## 手动控制轮询

结合 `manual` 选项和轮询功能，你可以实现更灵活的轮询控制：

:::demo

```vue
<template>
  <section>
    <n-card title="手动控制轮询">
      <n-space vertical>
        <n-flex>
          <n-button 
            type="primary" 
            @click="run"
            :disabled="isLoading"
          >
            开始轮询
          </n-button>
          <n-button 
            type="default" 
            @click="cancel"
            :disabled="!isLoading"
          >
            停止轮询
          </n-button>
          <n-button 
            type="info" 
            @click="refresh"
          >
            立即刷新
          </n-button>
        </n-flex>
        <n-spin :show="isLoading && !data">
          <div v-if="data" class="manual-info">
            <n-statistic 
              label="数据值" 
              :value="data.value"
              :precision="2"
            />
            <p><strong>状态:</strong> {{ isLoading ? '轮询中' : '已停止' }}</p>
            <p><strong>轮询次数:</strong> {{ data.count }}</p>
            <p><strong>最后更新:</strong> {{ data.timestamp }}</p>
          </div>
          <n-empty v-else description="点击开始轮询按钮"> </n-empty>
        </n-spin>
      </n-space>
    </n-card>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { 
  NSpin, 
  NEmpty, 
  NCard, 
  NSpace, 
  NFlex,
  NButton,
  NStatistic 
} from "naive-ui";

interface ManualData {
  value: number;
  count: number;
  timestamp: string;
}

let manualCount = 0;

const getManualData = (): Promise<ManualData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      manualCount++;
      resolve({
        value: Math.random() * 1000,
        count: manualCount,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 500);
  });
};

const { data, isLoading, run, cancel, refresh } = useRequest(getManualData, {
  manual: true, // 手动控制
  pollingInterval: 2000, // 每2秒轮询
  onSuccess: () => {
    console.log('手动轮询请求成功');
  }
});
</script>
<style scoped>
.manual-info p {
  margin: 12px 0;
}
</style>
```

:::

## 最佳实践

### 1. 合理设置轮询间隔
```ts
// ✅ 好的做法：根据数据更新频率设置合理间隔
const { data } = useRequest(getStockPrice, {
  pollingInterval: 5000, // 股价数据每5秒更新一次
});

// ❌ 避免：过于频繁的轮询
const { data } = useRequest(getStockPrice, {
  pollingInterval: 100, // 过于频繁，可能造成性能问题
});
```

### 2. 优化页面隐藏时的行为
```ts
// ✅ 推荐：页面隐藏时暂停轮询以节省资源
const { data } = useRequest(getRealTimeData, {
  pollingInterval: 3000,
  pollingWhenHidden: false, // 页面隐藏时暂停
});
```

### 3. 合理配置错误重试
```ts
// ✅ 好的做法：设置适当的重试次数和间隔
const { data } = useRequest(getApiData, {
  pollingInterval: 5000,
  errorRetryCount: 3, // 重试3次
  errorRetryInterval: 2000, // 重试间隔2秒
});
```

### 4. 响应式配置
```ts
// ✅ 推荐：使用响应式配置动态调整轮询行为
const pollingInterval = ref(3000);
const pollingWhenHidden = ref(true);

const { data } = useRequest(getData, {
  pollingInterval, // 响应式间隔
  pollingWhenHidden, // 响应式控制
});
```

