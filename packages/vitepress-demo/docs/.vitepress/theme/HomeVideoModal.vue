<template>
  <div class="home-video-entry">
    <button class="home-video-button" type="button" @click="show = true">
      观看功能演示
    </button>
    <NModal v-model:show="show" preset="card" title="Vue3Request 功能演示" class="home-video-modal"
      aria-label="Vue3Request 功能演示" :bordered="false" :mask-closable="true" :close-on-esc="true"
      display-directive="if" @after-leave="afterClose">
      <div class="home-video-tabs" role="tablist" aria-label="功能视频">
        <button v-for="feature in features" :id="`video-tab-${feature.id}`" :key="feature.id"
          type="button" role="tab" :aria-selected="activeFeature === feature.id"
          aria-controls="home-feature-video" :tabindex="activeFeature === feature.id ? 0 : -1"
          class="home-video-tab" @click="switchFeature(feature.id)" @keydown="onTabKeydown($event, feature.id)">
          {{ feature.label }}
        </button>
      </div>
      <div id="home-feature-video" class="home-video-stage" role="tabpanel" :aria-labelledby="`video-tab-${activeFeature}`" :aria-busy="switching">
      <video ref="video" class="home-demo-video" :src="videoSrc"
        :poster="posterSrc" :aria-label="`${selectedVideo.label}视频演示`" controls autoplay muted playsinline preload="metadata"
        @loadeddata="revealVideo" @error="handleVideoError">
        你的浏览器不支持视频播放，请使用下方链接打开视频。
      </video>
      <canvas v-show="switching" ref="cover" class="home-video-cover" aria-hidden="true" />
      </div>
      <p v-if="hasError" role="alert" class="home-video-error">
        视频加载失败，请稍后重试或直接打开视频。
      </p>
      <div class="home-video-footer">
        <span>{{ selectedVideo.summary }}</span>
        <a :href="videoSrc" target="_blank" rel="noopener noreferrer">直接打开视频</a>
        <button type="button" class="home-video-skip" @click="show = false">
          关闭，开始阅读
        </button>
      </div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";
import { NModal } from "naive-ui";

const features = [
  { id: "all", label: "完整演示", file: "vue3-request-demo", summary: "缓存、重试、中止等精选功能串讲" },
  { id: "basic", label: "Basic 基本使用", file: "basic", summary: "data、res、error、loading：请求、成功、失败与恢复" },
  { id: "parameters", label: "参数管理", file: "parameters", summary: "默认参数、动态传参与 params 记录" },
  { id: "lifecycle", label: "生命周期", file: "lifecycle", summary: "成功和失败时的生命周期顺序" },
  { id: "refresh", label: "刷新", file: "refresh", summary: "复用上次 params，重复请求最新资料" },
  { id: "cancel", label: "取消响应", file: "cancel", summary: "忽略旧 Promise 结果，后续仍可再次请求" },
  { id: "abort", label: "中止请求", file: "abort", summary: "Run → Abort → 再次 Run" },
  { id: "polling", label: "轮询", file: "polling", summary: "系统状态轮询与页面隐藏控制" },
  { id: "ready", label: "Ready", file: "ready", summary: "满足登录条件后自动请求" },
  { id: "cache", label: "缓存 & SWR", file: "cache", summary: "先展示缓存，再在后台更新" },
  { id: "retry", label: "错误重试", file: "retry", summary: "错误重试与默认指数退避" },
  { id: "throttle", label: "节流", file: "throttle", summary: "持续输入时按间隔执行，默认首尾触发" },
  { id: "debounce", label: "防抖", file: "debounce", summary: "停止输入后再执行，减少重复请求" },
  { id: "focus", label: "屏幕聚焦重新请求", file: "focus", summary: "窗口重新聚焦时自动刷新数据" },
];
const activeFeature = ref("all");
const selectedVideo = computed(() => features.find((item) => item.id === activeFeature.value) ?? features[0]);
const videoSrc = computed(() => withBase(`/media/${selectedVideo.value.file}.mp4`));
const posterSrc = computed(() => withBase(`/media/${activeFeature.value === "all" ? "vue3-request-demo-poster" : selectedVideo.value.file}.png`));

const show = ref(false);
const hasError = ref(false);
const video = ref<HTMLVideoElement | null>(null);
const cover = ref<HTMLCanvasElement | null>(null);
const switching = ref(false);
let playbackVersion = 0;
let pendingFrame: number | undefined;
let pendingPaint: number | undefined;

const cancelPendingFrame = () => {
  if (pendingFrame !== undefined) video.value?.cancelVideoFrameCallback(pendingFrame);
  pendingFrame = undefined;
  if (pendingPaint !== undefined) cancelAnimationFrame(pendingPaint);
  pendingPaint = undefined;
};

const stopVideo = () => {
  playbackVersion++;
  cancelPendingFrame();
  video.value?.pause();
};

const revealVideo = () => {
  const player = video.value;
  if (!show.value || !player || player.currentSrc !== new URL(videoSrc.value, window.location.href).href) return;
  const version = playbackVersion;
  const reveal = () => {
    // 视频在独立合成层绘制。跨过两次浏览器绘制机会后再移除旧帧。
    pendingPaint = requestAnimationFrame(() => {
      pendingPaint = requestAnimationFrame(() => {
        pendingPaint = undefined;
        if (version === playbackVersion && show.value) switching.value = false;
      });
    });
  };
  cancelPendingFrame();
  if (typeof player.requestVideoFrameCallback === "function") {
    pendingFrame = player.requestVideoFrameCallback(() => {
      pendingFrame = undefined;
      reveal();
    });
  } else {
    reveal();
  }
};

const afterClose = () => {
  // 若退出动画期间又打开，不清理新一轮的内容。
  if (show.value) return;
  switching.value = false;
};

const handleVideoError = () => {
  if (!show.value) return;
  cancelPendingFrame();
  switching.value = false;
  hasError.value = true;
};

const switchFeature = (value: string | number) => {
  if (value === activeFeature.value || !features.some((item) => item.id === value)) return;
  const player = video.value;
  const canvas = cover.value;
  // 新视频首帧就绪前保留旧画面；快速连续切换时沿用已有遮罩。
  if (!switching.value && player && canvas && player.readyState >= 2) {
    const context = canvas.getContext("2d");
    if (context) {
      canvas.width = player.videoWidth;
      canvas.height = player.videoHeight;
      context.drawImage(player, 0, 0, canvas.width, canvas.height);
      switching.value = true;
    }
  }
  stopVideo();
  hasError.value = false;
  activeFeature.value = String(value);
};

const onTabKeydown = (event: KeyboardEvent, id: string) => {
  const index = features.findIndex(feature => feature.id === id);
  let next: number;
  if (event.key === "ArrowRight") next = (index + 1) % features.length;
  else if (event.key === "ArrowLeft") next = (index - 1 + features.length) % features.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = features.length - 1;
  else return;
  event.preventDefault();
  switchFeature(features[next].id);
  const current = event.currentTarget as HTMLButtonElement;
  current.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
};

// 每次页面刷新后，仅在首次进入首页时自动展示；站内导航不重置。
const autoOpened = inject("home-video-auto-opened", ref(false));
onMounted(() => {
  if (!autoOpened.value) {
    autoOpened.value = true;
    show.value = true;
  }
});
watch(
  show,
  (visible) => {
    if (!visible) {
      stopVideo();
    }
    else {
      hasError.value = false;
    }
  },
  { flush: "sync" },
);
onBeforeUnmount(stopVideo);
</script>

<style>
.home-video-entry {
  margin-top: 20px;
}

.home-video-button {
  padding: 8px 0;
  color: var(--vp-c-brand-1);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.home-video-button:hover {
  text-decoration: underline;
}

.home-video-modal.n-card {
  width: min(1200px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow: auto;
}

.home-video-stage {
  position: relative;
  width: 100%;
  max-height: calc(100dvh - 260px);
  aspect-ratio: 16 / 9;
  object-fit: contain;
  background: #071310;
  border-radius: 8px;
  overflow: hidden;
}

.home-demo-video,
.home-video-cover {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-video-cover {
  pointer-events: none;
  background: #071310;
}

.home-video-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.home-video-tab {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 9px 14px;
  font-size: 14px;
  line-height: 1.5;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.home-video-tab[aria-selected="true"] {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.home-video-tab:hover,
.home-video-tab:focus-visible {
  color: var(--vp-c-brand-1);
  outline: 2px solid var(--vp-c-brand-soft);
  outline-offset: 2px;
}

.home-video-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 16px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.home-video-footer a,
.home-video-skip {
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

.home-video-skip {
  margin-left: auto;
  padding: 6px 0;
}

.home-video-error {
  margin: 12px 0;
  color: var(--vp-c-danger-1);
}

@media (max-width: 640px) {
  .home-video-skip {
    margin-left: 0;
  }
}
</style>
