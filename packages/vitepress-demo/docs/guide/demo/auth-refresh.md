# 鉴权 Token 刷新

请求返回 `401` 时，`useRequest` 可以自动刷新 Token 并重放原请求。该能力由内置插件 `useAuthRefreshPlugin` 提供，配置 `isUnauthorized`、`refreshToken`、`onUnauthorized` 三个选项即可启用。

## 基本使用

`isUnauthorized` 由你决定如何识别未授权错误，不依赖任何请求库。只要错误对象能拿到 401 状态即可：

```ts
const isUnauthorized = (error: unknown) =>
  (error as { status?: number } | null)?.status === 401;

const { data, loading } = useRequest(getOrders, {
  isUnauthorized,
  refreshToken: authStore.refreshToken,
  onUnauthorized: () => {
    authStore.clearAuth();
    router.push("/login");
  },
});
```

多个请求同时收到 `401` 时只会刷新一次 Token，其余请求等待刷新完成后重放；刷新失败或重放后仍 `401` 会触发 `onUnauthorized`。刷新与重放都在 `onRequest` 内完成，用户只会看到一次 `loading → 成功`。

:::demo

```vue
<template>
  <section>
    <n-space vertical :size="12">
      <n-space wrap>
        <n-button type="primary" :loading="loading" @click="handleRun">
          发起请求
        </n-button>
        <n-button @click="invalidate">使 Token 失效</n-button>
        <n-button @click="disableRefresh">禁用刷新（模拟刷新失败）</n-button>
        <n-button @click="simulateStillInvalid">模拟刷新后仍无效</n-button>
        <n-button quaternary @click="reset">重置</n-button>
      </n-space>

      <n-space>
        <n-tag :type="tokenValid ? 'success' : 'error'">
          token：{{ tokenValid ? "有效" : "已失效" }}
        </n-tag>
        <n-tag :type="refreshEnabled ? 'info' : 'warning'">
          刷新能力：{{ refreshEnabled ? "可用" : "已禁用" }}
        </n-tag>
      </n-space>

      <n-alert v-if="showResult && error" type="error" :show-icon="false">
        {{ error.message }}
      </n-alert>

      <pre v-if="showResult && data">{{ data }}</pre>

      <n-space v-if="logs.length" vertical :size="6">
        <n-space v-for="log in logs" :key="log.id" :size="8" align="center">
          <n-tag size="small" :type="log.type">{{ log.time }}</n-tag>
          <n-text>{{ log.text }}</n-text>
        </n-space>
      </n-space>
      <n-empty v-else description="点击「发起请求」观察刷新与重放过程" />
    </n-space>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRequest } from "@async-handler/request/vue3-request";
import { NAlert, NButton, NEmpty, NSpace, NTag, NText } from "naive-ui";

interface IResult {
  code: number;
  message: string;
  data: {
    token: string;
  };
}

type Log = {
  id: number;
  type: "info" | "success" | "error" | "warning";
  text: string;
  time: string;
};

const tokenValid = ref(false);
const refreshEnabled = ref(true);
const refreshStillInvalid = ref(false);
const tokenSeq = ref(0);
const logs = ref<Log[]>([]);
const showResult = ref(true);
let logId = 0;

const pushLog = (type: Log["type"], text: string) => {
  logs.value = [
    {
      id: ++logId,
      type,
      text,
      time: new Date().toLocaleTimeString(),
    },
    ...logs.value,
  ].slice(0, 10);
};

// 不绑定任何请求库：错误对象带 status 即可，axios/fetch/自定义均可
const isUnauthorized = (error: unknown) =>
  (error as { status?: number } | null)?.status === 401;

const create401 = () =>
  Object.assign(new Error("401 Unauthorized"), { status: 401 });

// 模拟业务接口：Token 失效时返回 401
const service = (): Promise<IResult> =>
  new Promise((resolve, reject) => {
    pushLog("info", "发起请求...");
    setTimeout(() => {
      if (!tokenValid.value) {
        pushLog("error", "服务端返回 401 Unauthorized");
        reject(create401());
        return;
      }
      pushLog("success", "请求成功，返回数据");
      resolve({
        code: 200,
        message: "success",
        data: {
          token: `token-v${tokenSeq.value}`,
        },
      });
    }, 500);
  });

// 模拟刷新 Token 的接口
const refreshToken = (): Promise<void> =>
  new Promise((resolve, reject) => {
    pushLog("info", "开始刷新 token...");
    setTimeout(() => {
      if (!refreshEnabled.value) {
        pushLog("error", "token 刷新失败");
        reject(new Error("refresh token 失败"));
        return;
      }
      if (refreshStillInvalid.value) {
        // 刷新接口成功返回，但新 token 依然不被服务端接受
        pushLog("warning", "token 刷新成功，但新 token 仍无效");
        resolve();
        return;
      }
      tokenValid.value = true;
      tokenSeq.value += 1;
      pushLog("success", `token 刷新成功（v${tokenSeq.value}）`);
      resolve();
    }, 800);
  });

const onUnauthorized = (_error: unknown, refreshError?: unknown) => {
  const reason =
    refreshError instanceof Error
      ? `刷新失败：${refreshError.message}`
      : "重放后仍 401";
  pushLog("error", `跳转登录页（${reason}）`);
};

const { data, error, loading, run } = useRequest(service, {
  manual: true,
  isUnauthorized,
  refreshToken,
  onUnauthorized,
});

const handleRun = () => {
  showResult.value = true;
  run();
};

const invalidate = () => {
  tokenValid.value = false;
  refreshStillInvalid.value = false;
  pushLog("info", "已使 Token 失效");
};

const disableRefresh = () => {
  tokenValid.value = false;
  refreshEnabled.value = false;
  refreshStillInvalid.value = false;
  pushLog("warning", "已禁用刷新（下次请求将刷新失败）");
};

const simulateStillInvalid = () => {
  tokenValid.value = false;
  refreshEnabled.value = true;
  refreshStillInvalid.value = true;
  pushLog("warning", "已模拟：刷新成功但新 token 仍无效");
};

const reset = () => {
  tokenValid.value = false;
  refreshEnabled.value = true;
  refreshStillInvalid.value = false;
  tokenSeq.value = 0;
  logs.value = [];
  showResult.value = false;
};
</script>
```

:::

## Options

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| isUnauthorized | 判断错误是否属于「未授权 / 401」，返回 `true` 才触发刷新 | `(error: unknown) => boolean` |
| refreshToken | 刷新 Token 的函数，成功 resolve、失败 reject | `() => Promise<unknown>` |
| onUnauthorized | 刷新失败或重放后仍 401 时触发，用于清理登录态并跳转登录页 | `(error: unknown, refreshError?: unknown) => void` |

## 贡献者 :shamrock:

<Team />
