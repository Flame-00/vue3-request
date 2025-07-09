<template>
    <Child v-if="show">
    </Child>
</template>
<script setup lang="ts">
import Child from './child.vue'
import { ref } from 'vue'

const show = ref(true)

</script>
<style scoped lang="scss"></style>