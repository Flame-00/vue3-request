<template>
    <div>
        <h1>Child{{ data }}</h1>
    </div>
</template>

<script setup lang="ts">
import { useAsyncHandler } from '@async-handler/request/useAsyncHandler'

const testService = () => {
    return new Promise((resolve) => {
        console.log('testService')
        setTimeout(() => {
            resolve('我是数据')
        }, 2000)
    })
}

const { data, isLoading } = useAsyncHandler(() => testService, {
    cacheKey: 'testService',
})

</script>

<style scoped lang="scss"></style>