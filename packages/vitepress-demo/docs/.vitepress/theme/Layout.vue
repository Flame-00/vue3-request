<template>
    <NConfigProvider :locale="zhCN" :theme="getTheme">
        <NMessageProvider>
            <NEl>
                <Layout><template #home-hero-image>
                        <img class="image-src" src="/logo.svg" />
                    </template>
                </Layout>
            </NEl>
        </NMessageProvider>
    </NConfigProvider>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
const { Layout } = DefaultTheme;
import { nextTick, provide, computed } from "vue";
import { NConfigProvider, NMessageProvider, darkTheme, NEl, zhCN } from 'naive-ui'
const { isDark } = useData();

const getTheme = computed(() => {
    return isDark.value ? darkTheme : null;
})

const enableTransitions = () =>
    "startViewTransition" in document &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions()) {
        isDark.value = !isDark.value;
        return;
    }

    const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        )}px at ${x}px ${y}px)`,
    ];
    const doc = document as any;
    await doc.startViewTransition(async () => {
        isDark.value = !isDark.value;
        await nextTick();
    }).ready;

    document.documentElement.animate(
        { clipPath: isDark.value ? clipPath.reverse() : clipPath },
        {
            duration: 300,
            easing: "ease-in",
            pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
        }
    );
});
</script>
<style>
.image-src {
    filter: drop-shadow(-2px 4px 6px #0003);
}

::view-transition-old(root),
::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
    z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
    z-index: 9999;
}

.VPSwitchAppearance {
    width: 22px !important;
}

.VPSwitchAppearance .check {
    transform: none !important;
}
</style>