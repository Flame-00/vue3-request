<template>
    <button @click="show = !show">点击</button>
 
    <Child v-if="show" />
</template>
<script setup lang="ts">
import Child from './child.vue'
import { ref } from 'vue'

const show = ref(true)

</script>
<style scoped lang="scss"></style>