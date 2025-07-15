<template>
    <Child v-if="show">
    </Child>
    <button @click="show = !show">切换</button>
</template>
<script setup lang="ts">
import Child from './child.vue'
import { ref } from 'vue'

const show = ref(true)

</script>
<style scoped lang="scss"></style>