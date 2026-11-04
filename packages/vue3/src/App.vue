<script setup lang="ts">
import { ref } from "vue";
import Demo from "./components/Demo.vue";
import Demo1 from "./Demo.vue";
import AuthRefreshDemo from "./components/AuthRefreshDemo.vue";
import { NMessageProvider } from "naive-ui";

const currentDemo = ref<"auth-refresh" | "segmented">("auth-refresh");
</script>

<template>
  <n-message-provider>
    <div class="demo-switch">
      <button type="button" :class="{ active: currentDemo === 'auth-refresh' }" @click="currentDemo = 'auth-refresh'">
        鉴权刷新插件
      </button>
      <button type="button" :class="{ active: currentDemo === 'segmented' }" @click="currentDemo = 'segmented'">
        分段控件
      </button>
    </div>
    <AuthRefreshDemo v-if="currentDemo === 'auth-refresh'" />
    <Demo1 v-else />
  </n-message-provider>
</template>

<style scoped>
.demo-switch {
  display: flex;
  gap: 8px;
  padding: 12px 24px;
}

.demo-switch button {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.demo-switch button.active {
  color: #fff;
  background: #18a058;
  border-color: #18a058;
}
</style>
