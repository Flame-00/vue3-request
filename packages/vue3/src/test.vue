<template>
    <NMessageProvider>
        <button @click="show = !show">{{ show ? '隐藏' : '显示' }}</button>
        <button @click="ready = !ready">ready{{ ready }}</button>
        <template v-if="show">
            <Child :ready="ready" />
            <Child1 :ready="ready" />
            <!-- <Child /> -->
            <hr>
            <!-- <Child1 /> -->
        </template>
    </NMessageProvider>

    <!-- <button @click="t1">测试1</button>
    <Loading v-if="loading1" />
    <button @click="t2">测试2</button>
    <Loading v-if="loading2" />
    <h2>{{ data1 }}</h2>
    <h2>{{ data2 }}</h2> -->
</template>
<script setup lang="ts">
import { NMessageProvider } from 'naive-ui'
import Child from './child.vue'
import Child1 from './child1.vue'
import { ref } from 'vue'


const ready = ref(false)
const queryMap = new Map<string, Promise<{ code: number, msg: string, data: number }>>()

const show = ref(true)
const loading1 = ref(false)
const data1 = ref<{ code: number, msg: string, data: number } | null>(null)
const loading2 = ref(false)
const data2 = ref<{ code: number, msg: string, data: number } | null>(null)

const test1 = () => {
    console.log(queryMap.has('test'))
    if (queryMap.has('test')) {
        return queryMap.get('test')
    }
    const promise = new Promise<{ code: number, msg: string, data: number }>((resolve, reject) => {
        console.log('只在创建时执行一次')
        setTimeout(() => {
            resolve({
                code: 200,
                msg: 'success',
                data: Date.now(),
            })
        }, 4000)
    })
    queryMap.set('test', promise)
    return promise
}
const test2 = () => {
    if (queryMap.has('test')) {
        return queryMap.get('test')
    }
    const promise = new Promise<{ code: number, msg: string, data: number }>((resolve, reject) => {
        setTimeout(() => {
            resolve({
                code: 200,
                msg: 'success',
                data: Date.now(),
            })
        }, 2000)
    })
    queryMap.set('test', promise)
    return promise
}

const query1 = async () => {
    loading1.value = true
    const res = await test1()
    loading1.value = false
    data1.value = res || null
    return res
}
const query2 = async () => {
    loading2.value = true
    const res = await test2()
    loading2.value = false
    data2.value = res || null
    return res
}


const t1 = async () => {
    const q1 = query1().then(res => {
        console.log(res, 'res1')
    })
    const q2 = query1().then(res => {
        console.log(res, 'res2')
    })
    console.log(queryMap, q1, q2, q1 === q2)
}

const t2 = async () => {
    const res = await query2()
    console.log(res, 'res2')
    console.log(test1() === test2())
}
</script>
<style scoped lang="scss"></style>