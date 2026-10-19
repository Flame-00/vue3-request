<template>
  <NConfigProvider :locale="zhCN" :theme="getTheme">
    <NMessageProvider>
      <NEl>
        <Layout
          ><template #home-hero-image>
            <img class="image-src" src="/logo.svg" />
          </template>
          <template #home-hero-actions-after>
            <HomeVideoModal />
          </template>
        </Layout>
      </NEl>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import HomeVideoModal from "./HomeVideoModal.vue";
const { Layout } = DefaultTheme;
import { computed, nextTick, provide, ref } from "vue";
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  NEl,
  zhCN,
} from "naive-ui";
const { isDark } = useData();
const getTheme = computed(() => {
  return isDark.value ? darkTheme : null;
});

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", ({ clientX, clientY }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const x = (100 * clientX) / innerWidth;
  const y = (100 * clientY) / innerHeight;
  const maxRadius =
    (100 * Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY),
    )) / (Math.hypot(innerWidth, innerHeight) / Math.SQRT2);

  document.documentElement.style.setProperty("--switch-x", `${x}%`);
  document.documentElement.style.setProperty("--switch-y", `${y}%`);
  document.documentElement.style.setProperty("--switch-r", `${maxRadius}%`);

  document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });
});

// Layout 在站内导航时保留；刷新页面后重新创建。
provide("home-video-auto-opened", ref(false));
</script>
<style>
.disabled {
  text-decoration: line-through;
}
.image-src {
  filter: drop-shadow(-2px 4px 6px #0003);
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-new(root) {
  animation: switch-appearance 300ms ease-in;
}
.dark::view-transition-new(root) {
  animation: none;
}
.dark::view-transition-old(root) {
  animation: switch-appearance 300ms ease-in reverse forwards;
  z-index: 1;
}
@keyframes switch-appearance {
  from {
    clip-path: circle(0 at var(--switch-x) var(--switch-y));
  }
  to {
    clip-path: circle(var(--switch-r) at var(--switch-x) var(--switch-y));
  }
}
.VPSwitchAppearance {
  width: 22px !important;
}
.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
