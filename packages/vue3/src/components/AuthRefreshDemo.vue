<template>
  <n-card class="auth-demo" title="鉴权 Token 刷新插件演示" :bordered="false">
    <n-space vertical :size="18">
      <n-alert type="info" :show-icon="false">
        模拟「token 失效返回 401 → 插件自动刷新 token → 重放原请求」，
        以及「刷新失败 / 重放仍 401 → 跳转登录」的完整流程。刷新与重放由
        <code>useAuthRefreshPlugin</code>（内置插件）自动完成，无需业务代码参与。
      </n-alert>

      <n-space wrap :size="12">
        <n-button type="primary" :loading="loading" @click="handleRun">
          发起请求
        </n-button>
        <n-button @click="handleInvalidate">使 token 失效</n-button>
        <n-button @click="handleDisableRefresh">
          禁用刷新（模拟刷新失败）
        </n-button>
        <n-button @click="handleSimulateStillInvalid">
          模拟刷新后仍无效
        </n-button>
        <n-button quaternary @click="handleReset">重置</n-button>
      </n-space>

      <n-space align="center" :size="12">
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

      <section class="panel">
        <div class="panel-title">返回数据</div>
        <pre v-if="showResult && data">{{ responseText }}</pre>
        <n-empty v-else description="暂无数据" />
      </section>

      <section class="panel">
        <div class="panel-title">执行日志</div>
        <n-space v-if="logs.length" vertical :size="8">
          <div v-for="log in logs" :key="log.id" class="log-row">
            <n-tag size="small" :type="logTypeMap[log.type]">{{ log.time }}</n-tag>
            <span>{{ log.text }}</span>
          </div>
        </n-space>
        <n-empty v-else description="点击「发起请求」观察刷新与重放过程" />
      </section>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRequest } from "../../../request/vue3-request";
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NSpace,
  NTag,
  useMessage,
} from "naive-ui";

defineOptions({
  name: "AuthRefreshDemo",
});

interface AuthResponse {
  code: number;
  message: string;
  data: {
    userId: number;
    name: string;
    token: string;
  };
}

type Log = {
  id: number;
  type: "info" | "success" | "error" | "warning";
  text: string;
  time: string;
};

const message = useMessage();

// 模拟后端与登录态
const tokenValid = ref(false);
const refreshEnabled = ref(true);
const refreshStillInvalid = ref(false);
const tokenSeq = ref(0);

const logs = ref<Log[]>([]);
const showResult = ref(true);
let logId = 0;

const logTypeMap: Record<Log["type"], "info" | "success" | "error" | "warning"> = {
  info: "info",
  success: "success",
  error: "error",
  warning: "warning",
};

const pushLog = (type: Log["type"], text: string) => {
  logs.value = [
    {
      id: ++logId,
      type,
      text,
      time: new Date().toLocaleTimeString(),
    },
    ...logs.value,
  ].slice(0, 12);
};

const create401 = () =>
  Object.assign(new Error("401 Unauthorized"), { status: 401 });

// 不绑定任何请求库：错误对象带 status 即可
const isUnauthorized = (error: unknown) =>
  (error as { status?: number } | null)?.status === 401;

// 模拟业务接口：token 失效时返回 401
const service = (): Promise<AuthResponse> =>
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
          userId: 1,
          name: "演示用户",
          token: `token-v${tokenSeq.value}`,
        },
      });
    }, 500);
  });

// 模拟刷新 token 的接口
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
  console.log(refreshError, _error, 'refreshError');
  const reason =
    refreshError instanceof Error
      ? `刷新失败：${refreshError.message}`
      : "重放后仍 401";
  pushLog("error", `跳转登录页（${reason}）`);
  message.warning("登录已失效，即将跳转登录页");
};

const { data, error, loading, run } = useRequest(service, {
  manual: true,
  isUnauthorized,
  refreshToken,
  onUnauthorized,
});

const responseText = computed(() =>
  data.value ? JSON.stringify(data.value, null, 2) : "(暂无数据)"
);

const handleRun = () => {
  showResult.value = true;
  run();
};

const handleInvalidate = () => {
  tokenValid.value = false;
  refreshStillInvalid.value = false;
  pushLog("info", "已使 token 失效");
};

const handleDisableRefresh = () => {
  tokenValid.value = false;
  refreshEnabled.value = false;
  refreshStillInvalid.value = false;
  pushLog("warning", "已禁用刷新（下次请求将刷新失败）");
};

const handleSimulateStillInvalid = () => {
  tokenValid.value = false;
  refreshEnabled.value = true;
  refreshStillInvalid.value = true;
  pushLog("warning", "已模拟：刷新成功但新 token 仍无效");
};

const handleReset = () => {
  tokenValid.value = false;
  refreshEnabled.value = true;
  refreshStillInvalid.value = false;
  tokenSeq.value = 0;
  logs.value = [];
  showResult.value = false;
};
</script>

<style scoped>
.auth-demo {
  max-width: 960px;
  margin: 24px auto;
}

.panel {
  padding: 14px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
}

.panel-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}

.log-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
}

pre {
  min-height: 120px;
  max-height: 260px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  color: #213547;
  background: #f6f8fa;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

code {
  padding: 2px 6px;
  background: var(--n-border-color);
  border-radius: 4px;
}

@media (max-width: 760px) {
  .auth-demo {
    margin: 12px;
  }
}
</style>
