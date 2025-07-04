<template>
    <div>
        <h1>Child{{ data }}</h1>
    </div>
</template>

<script setup lang="ts">
import { useAsyncHandler } from '@flame00/vue3-async-handler'

const testService = (): Promise<string> => {
    return new Promise((resolve) => {
        console.log('testService')
        setTimeout(() => {
            resolve('我是数据')
        }, 2000)
    })
}

const { data, isLoading } = useAsyncHandler(() => testService, {
    cacheKey: 'testService',
    onSuccess: (data) => {
        console.log('onSuccess', data)
    }
})

</script>

<style scoped lang="scss"></style>