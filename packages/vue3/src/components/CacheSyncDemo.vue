<template>
  <n-card title="Cache Sync Repro (Same cacheKey, two instances)">
    <n-space vertical :size="12">
      <n-text depth="3">
        Expected: click "Run B only", A should also update if cache broadcast works.
      </n-text>

      <n-space>
        <n-button type="primary" @click="runB">Run B only</n-button>
        <n-button @click="runA">Run A only</n-button>
        <n-button @click="reloadPage">Reload page</n-button>
      </n-space>

      <n-space align="start" :size="16">
        <div class="panel">
          <n-text strong>Instance A (first subscriber)</n-text>
          <n-tag size="small" :bordered="false">loading: {{ aLoading }}</n-tag>
          <pre>{{ formatData(aData) }}</pre>
        </div>
        <div class="panel">
          <n-text strong>Instance B (request trigger)</n-text>
          <n-tag size="small" :bordered="false">loading: {{ bLoading }}</n-tag>
          <pre>{{ formatData(bData) }}</pre>
        </div>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace, NTag, NText } from "naive-ui";
import { clearCache, useRequest } from "../../../request/vue3-request";

type DemoData = {
  data: {
    from: "A" | "B";
    seq: number;
    at: string;
  };
};

const CACHE_KEY = "cache-sync-repro";
clearCache(CACHE_KEY);

let seq = 0;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createService = (from: "A" | "B") => {
  return async (): Promise<DemoData> => {
    await sleep(600);
    seq += 1;
    return {
      data: {
        from,
        seq,
        at: new Date().toLocaleTimeString(),
      },
    };
  };
};

const {
  data: aData,
  loading: aLoading,
  run: runA,
} = useRequest(createService("A"), {
  manual: true,
  cacheKey: CACHE_KEY,
  staleTime: 0,
});

const {
  data: bData,
  loading: bLoading,
  run: runB,
} = useRequest(createService("B"), {
  manual: true,
  cacheKey: CACHE_KEY,
  staleTime: 0,
});

const reloadPage = () => window.location.reload();

const formatData = (value: DemoData | undefined) =>
  value ? JSON.stringify(value, null, 2) : "(empty)";
</script>

<style scoped>
.panel {
  width: 48%;
  min-width: 260px;
}

pre {
  margin: 8px 0 0;
  padding: 10px;
  background: #f7f8fa;
  border-radius: 8px;
  white-space: pre-wrap;
}
</style>
