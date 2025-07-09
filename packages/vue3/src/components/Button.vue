<template>
    <button :class="`xl-button xl-button--${type}`" @click="handleClick">
        <slot />
    </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'click'): void
}>()

withDefaults(defineProps<{
    type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default'
}>(), {
    type: 'default'
})

const handleClick = () => {
    emit('click')
}
</script>

<style scoped lang="scss"></style>