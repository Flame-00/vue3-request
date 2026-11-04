<template>
    <div class="tab-container">
        <div class="segmented-control">
            <!-- 1. 父层：只负责平移位置 -->
            <div class="slider-mover" :style="moverStyle">
                <!-- 2. 子层：只负责宽度变化 -->
                <div class="slider-bg" :style="bgStyle"></div>
            </div>

            <!-- 按钮列表 -->
            <button v-for="(tab, index) in tabs" :key="tab.value" :ref="(el) => setBtnRef(el, index)" type="button"
                :class="['tab-label', { active: activeTab === index }]" @click="handleTabClick(index)">
                {{ tab.label }}
            </button>
        </div>

        <div class="panels">
            <transition name="fade" mode="out-in">
                <div class="panel" :key="activeTab">
                    {{ tabs[activeTab]?.content }}
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ref, nextTick, onMounted, onUnmounted,
    type CSSProperties, type ComponentPublicInstance
} from 'vue'

interface TabItem {
    label: string
    value: string
    content: string
}

const activeTab = ref<number>(0)
const btnRefs = ref<HTMLButtonElement[]>([])

// 分离位置和宽度
const moverStyle = ref<CSSProperties>({ transform: 'translateX(0px)' })
const bgStyle = ref<CSSProperties>({ width: '0px' })

const tabs: TabItem[] = [
    { label: '个人', value: 'personal', content: '这是【个人】面板的内容。' },
    { label: 'Business', value: 'business', content: '这是【Business】面板的内容。' },
    { label: 'Enterprise', value: 'enterprise', content: '这是【Enterprise】面板的内容。' }
]

const setBtnRef = (el: Element | ComponentPublicInstance | null, index: number) => {
    if (el) btnRefs.value[index] = el as HTMLButtonElement
}

// 计算滑块位置和宽度
const updateSlider = () => {
    const activeBtn = btnRefs.value[activeTab.value]
    if (!activeBtn) return

    moverStyle.value = {
        transform: `translateX(${activeBtn.offsetLeft - 4}px)`
    }
    bgStyle.value = {
        width: `${activeBtn.offsetWidth}px`
    }
}

const handleTabClick = (index: number) => {
    activeTab.value = index
    updateSlider()
}

onMounted(() => {
    nextTick(updateSlider)
    window.addEventListener('resize', updateSlider)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateSlider)
})
</script>

<style scoped>
.tab-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 40px;
}

.segmented-control {
    display: inline-flex;
    position: relative;
    background-color: #f2f2f2;
    padding: 4px;
    border-radius: 999px;
}

/* 父层：平移 */
.slider-mover {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    z-index: 1;
    /* 平滑移动的动画曲线 */
    transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 子层：宽度 + 基础阴影 */
.slider-bg {
    height: 100%;
    background-color: #ffffff;
    border-radius: 999px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
    /* 宽度变化的平滑动画曲线 */
    transition: width 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 按钮基础样式 */
.tab-label {
    position: relative;
    z-index: 2;
    appearance: none;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 8px 20px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 500;
    color: #8c8c8c;
    white-space: nowrap;
    user-select: none;
    /* 文字颜色渐变 */
    transition: color 0.3s ease;
}

/* 选中态仅改变文字颜色 */
.tab-label.active {
    color: #1a1a1a;
}

/* 面板样式 */
.panels {
    width: 100%;
    max-width: 400px;
}

.panel {
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    text-align: center;
    font-size: 15px;
    color: #333;
}

/* 面板切换动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>