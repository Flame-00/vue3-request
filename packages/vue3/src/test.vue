<template>
    <template v-if="show">
        <Child />
        <Child />
        <hr>
        <Child1 />
    </template>
    <button @click="show = !show">切换</button>
</template>
<script setup lang="ts">
import Child from './child.vue'
import Child1 from './child1.vue'
import { ref } from 'vue'

const show = ref(true)

</script>
<style scoped lang="scss"></style>