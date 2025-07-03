# Vitepress Demo

:::demo

```vue
<template>
  <div>{{ data }}</div>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@flame00/vue3-async-handler-hooks";

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

const testService = async () => {
  return fetch("https://api.avdgw.com/api/cai", requestOptions)
    .then((response) => response.text())
};
const { run, data } = useAsyncHandler(() => testService);
</script>

```

:::
