<template>
  <ChildComponent v-if="show" />
  <hr>
  <Button type="primary" @click="show = !show">{{ show ? '隐藏组件' : '显示组件' }}</Button>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import message from '../../vitepress-demo/docs/utils/message';// 文档示例message,不用理会
import { h } from "vue";
import Loading from './components/Loading.vue' // 文档示例组件,不用理会
import Button from './components/Button.vue' // 文档示例组件,不用理会
import { ref } from "vue";

const show = ref(true)

const testService = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('我是数据');
      } else {
        reject(new Error('接口错误'));
      }
    }, 1500);
  });
};

function generateComponent() {
  return {
    setup() {
      const { run, data, error, isLoading, cancel } = useAsyncHandler(() => testService, {
        manual: true,
        onSuccess: (data) => {
          message.success(data);
        },
        onError: (error) => {
          message.error(error);
        },
      });
      return () => {
        return h('div', [
          h(Button, { type: 'primary', onClick: run }, {
            default: () => '点击请求'
          }),
          h(Button, { type: 'danger', onClick: cancel }, {
            default: () => '取消响应'
          }),
          h("div", { style: "margin: 10px" }, [
            data.value && h("h3", data.value),
            error.value && h("h3", { id: "error" }, error.value.message),
            isLoading.value && h("div", h(Loading)),
          ]),
        ])
      }
    }
  }
}
const ChildComponent = generateComponent()

</script>
