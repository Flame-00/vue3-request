<script lang="ts" setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div style="margin-bottom: 6px">This is a test demo!</div>
  <div>
    <button @click="count++">++count</button>
    <span>count = {{ count }}</span>
  </div>
</template>

<style scoped>
button {
  border: 1px solid #999;
  border-radius: 4px;
  padding: 4px 10px;
}
</style>