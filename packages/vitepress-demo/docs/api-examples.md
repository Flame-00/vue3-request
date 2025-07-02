# Vitepress Demo


:::demo

```vue
<template>
  <div>{{ data }}</div>
</template>
<script setup lang="ts">
import { useAsyncHandler } from '@useAsyncHandler/request/useAsyncHandler'

const testService = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1)
        }, 1000)
    })
}
const { run, data } = useAsyncHandler(() => testService)

</script>
```
:::