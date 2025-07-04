# 用例

:::demo

```vue
<template>
    <pre>{{ data }}</pre>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@flame00/vue3-async-handler";
import {computed} from 'vue'
const requestOptions = {
  method: "GET",
  redirect: "follow",
  
};

const testService = (): Promise<string> => {
    return new Promise((resolve) => {
        console.log('testService')
        setTimeout(() => {
            resolve({
                code: 200,
                data: '我是数据'
            })
        }, 2000)
    })
}
const { run, data } = useAsyncHandler(() => testService);

</script>
```

:::
