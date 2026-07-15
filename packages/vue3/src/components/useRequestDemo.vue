<template>
  <n-card class="use-request-demo" title="useRequest 请求示例" :bordered="false">
    <n-space vertical :size="18">
      <n-space class="query-bar" align="center" :size="12">
        <n-input
          v-model:value="keyword"
          class="keyword-input"
          clearable
          placeholder="输入关键字，试试 error"
        />
        <n-input-number
          v-model:value="page"
          class="page-input"
          :min="1"
          :max="5"
          :show-button="false"
          placeholder="页码"
        />
        <n-button type="primary" :loading="loading" @click="handleSearch">
          查询
        </n-button>
        <n-button :disabled="loading" @click="handleRefresh">刷新</n-button>
        <n-button type="warning" ghost :disabled="!loading" @click="handleCancel">
          取消
        </n-button>
        <n-button quaternary @click="handleClearCache">清缓存</n-button>
      </n-space>

      <n-space align="center" :size="10">
        <n-tag :type="loading ? 'warning' : isFinished ? 'success' : 'default'">
          loading: {{ loading }}
        </n-tag>
        <n-tag :type="isFinished ? 'success' : 'default'">
          isFinished: {{ isFinished }}
        </n-tag>
        <n-text depth="3">
          当前参数：{{ formatQuery(currentQuery) }}
        </n-text>
      </n-space>

      <n-alert v-if="error" type="error" :show-icon="false">
        {{ error.message }}
      </n-alert>

      <n-spin :show="loading">
        <div class="content-grid">
          <section class="panel">
            <div class="panel-title">resKey = "list" 提取结果</div>
            <n-table v-if="users.length" size="small" :single-line="false">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>姓名</th>
                  <th>角色</th>
                  <th>城市</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.role }}</td>
                  <td>{{ user.city }}</td>
                  <td>
                    <n-tag
                      size="small"
                      :type="user.status === 'active' ? 'success' : 'default'"
                    >
                      {{ user.status === "active" ? "在线" : "离线" }}
                    </n-tag>
                  </td>
                </tr>
              </tbody>
            </n-table>
            <n-empty v-else description="暂无数据" />
          </section>

          <section class="panel">
            <div class="panel-title">完整响应 data</div>
            <pre>{{ responseText }}</pre>
          </section>
        </div>
      </n-spin>

      <section class="log-panel">
        <div class="panel-title">请求日志</div>
        <n-space v-if="logs.length" vertical :size="8">
          <div v-for="log in logs" :key="log.id" class="log-row">
            <n-tag size="small" :type="logTypeMap[log.type]">
              {{ log.time }}
            </n-tag>
            <span>{{ log.text }}</span>
          </div>
        </n-space>
        <n-empty v-else description="还没有请求记录" />
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
  NInput,
  NInputNumber,
  NSpace,
  NSpin,
  NTable,
  NTag,
  NText,
} from "naive-ui";

defineOptions({
  name: "UseRequestDemo",
});

type UserStatus = "active" | "offline";

type UserItem = {
  id: number;
  name: string;
  role: string;
  city: string;
  status: UserStatus;
};

type DemoQuery = {
  keyword: string;
  page: number;
  pageSize: number;
};

type DemoResponse = {
  code: number;
  message: string;
  list: UserItem[];
  total: number;
  requestedAt: string;
  query: DemoQuery;
};

type RequestLog = {
  id: number;
  type: "info" | "success" | "error";
  text: string;
  time: string;
};

const keyword = ref("Vue");
const page = ref<number | null>(1);
const pageSize = 5;
const logs = ref<RequestLog[]>([]);

let logId = 0;

const logTypeMap: Record<RequestLog["type"], "info" | "success" | "error"> = {
  info: "info",
  success: "success",
  error: "error",
};

const names = ["林夏", "陈一", "周澄", "许安", "沈舟", "叶青", "宋予", "韩川"];
const roles = ["前端工程师", "接口联调", "产品经理", "测试工程师"];
const cities = ["杭州", "上海", "深圳", "成都"];

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const buildQuery = (): DemoQuery => ({
  keyword: keyword.value.trim() || "全部",
  page: Math.max(page.value ?? 1, 1),
  pageSize,
});

const createCacheKey = (query: DemoQuery) =>
  `use-request-demo:${query.keyword}:${query.page}:${query.pageSize}`;

const formatQuery = (query?: DemoQuery) => {
  if (!query) {
    return "未发起请求";
  }

  return `${query.keyword} / 第 ${query.page} 页 / ${query.pageSize} 条`;
};

const pushLog = (type: RequestLog["type"], text: string) => {
  logs.value = [
    {
      id: ++logId,
      type,
      text,
      time: new Date().toLocaleTimeString(),
    },
    ...logs.value,
  ].slice(0, 6);
};

const queryUsers = async (query: DemoQuery): Promise<DemoResponse> => {
  await sleep(900);

  // 这里故意保留一个可触发的失败条件，方便观察 error 和 onError 的表现。
  if (query.keyword.toLowerCase() === "error") {
    throw new Error("模拟接口异常：关键字 error 会触发失败态");
  }

  const offset = (query.page - 1) * query.pageSize;
  const list = Array.from({ length: query.pageSize }, (_, index) => {
    const serial = offset + index + 1;

    return {
      id: serial,
      name: `${query.keyword}-${names[serial % names.length]}`,
      role: roles[serial % roles.length],
      city: cities[serial % cities.length],
      status: serial % 3 === 0 ? "offline" : "active",
    } satisfies UserItem;
  });

  return {
    code: 200,
    message: "success",
    list,
    total: 40,
    requestedAt: new Date().toLocaleString(),
    query,
  };
};

const {
  data,
  res,
  error,
  loading,
  isFinished,
  params,
  run,
  refresh,
  cancel,
  clearCache: clearRequestCache,
} = useRequest<DemoResponse, "list", [DemoQuery]>(queryUsers, {
  manual: true,
  defaultParams: [buildQuery()],
  resKey: "list",
  cacheKey: (requestParams) => createCacheKey(requestParams?.[0] ?? buildQuery()),
  cacheTime: 60_000,
  staleTime: 10_000,
  onBefore(requestParams) {
    pushLog("info", `开始请求：${formatQuery(requestParams[0])}`);
  },
  onSuccess(requestParams) {
    pushLog("success", `请求成功：${formatQuery(requestParams[0])}`);
  },
  onError(requestParams) {
    pushLog("error", `请求失败：${formatQuery(requestParams[0])}`);
  },
});

const users = computed(() => res.value ?? []);
const currentQuery = computed(() => params.value[0]);
const responseText = computed(() =>
  data.value ? JSON.stringify(data.value, null, 2) : "暂无完整响应",
);

const handleSearch = () => {
  run(buildQuery());
};

const handleRefresh = () => {
  refresh();
};

const handleCancel = () => {
  cancel();
  pushLog("info", "已取消当前请求结果更新");
};

const handleClearCache = () => {
  clearRequestCache(createCacheKey(buildQuery()));
  pushLog("info", "已清理当前查询条件的缓存");
};
</script>

<style scoped>
.use-request-demo {
  max-width: 1120px;
  margin: 24px auto;
}

.query-bar {
  row-gap: 10px;
}

.keyword-input {
  width: min(320px, 100%);
}

.page-input {
  width: 96px;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 16px;
}

.panel,
.log-panel {
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
  min-height: 250px;
  max-height: 360px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  color: #213547;
  background: #f6f8fa;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 760px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .use-request-demo {
    margin: 12px;
  }
}
</style>
