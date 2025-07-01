<template>
  <div>
    <h1>Hello World {{ count }}</h1>
    <button @click="count++">Click me</button>
  </div>
</template> 
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

</script>