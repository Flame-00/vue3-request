<template>
  <div>
    <NRadioGroup v-model:value="type" @update:value="handleRun">
      <NSpace>
        <NRadio :key="0" :value="0"> Chinese Names </NRadio>
        <NRadio :key="1" :value="1"> English Names </NRadio>
      </NSpace>
    </NRadioGroup>
    <NSpin :show="loading">
      <ul v-if="data">
        <li v-for="item in data" :key="item">{{ item }}</li>
      </ul>
    </NSpin>
  </div>
</template>

<script lang="ts">
import { NRadio, NRadioGroup, NSpace, NSpin } from 'naive-ui';
import { defineComponent, ref } from 'vue';
import { useRequest } from "vue3-request";

const cnameData = ['华强', '大鹏', '猹', '张三', '马冬梅'];
const nameData = ['HuaQiang', 'Peng', 'Cha', 'ZhangSan', 'MaDongMei'];

function getLocalName(type: number): Promise<string[]> {
  console.log(`[vue-request] fetching data..., type = ${type}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(type ? nameData : cnameData);
    }, 1000);
  });
} 


export default defineComponent({
  components: {
    NRadioGroup,
    NRadio,
    NSpin,
    NSpace,
  },
  setup() {
    const type = ref(0);
    const { data, loading, run, } = useRequest(getLocalName, {
      defaultParams: [0],
      
      cacheKey: params => {
        console.log('params', params)
        if (params?.[0] !== undefined) {
          return `CacheDynamic-${params[0]}`;
        }
        // default params is 0
        return '';
      },
    });

    const handleRun = (value: number) => {
      console.log("handleRun", value)
      run(value);
    };

    return {
      data,
      loading,
      type,
      handleRun,
    };
  },
});
</script>

<style scoped lang="scss"></style>