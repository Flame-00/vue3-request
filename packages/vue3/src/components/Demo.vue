<template>
  <n-el class="box">
    <n-button type="primary" ghost @click="reload"> 刷新页面</n-button>
    <hr />
    <div class="action">
      <n-button type="primary" @click="run"> Run</n-button>
      <n-button type="primary" @click="refresh"> Refresh</n-button>
      <n-button type="error" @click="cancel"> Cancel</n-button>
    </div>
    <n-card title="模拟请求">
      <n-spin :show="(loading) as unknown as  boolean">
        data:
        <pre v-if="data">{{ data }}</pre>
        <hr />
        res
        <pre v-if="res">{{ res }}</pre>
        <n-text type="error" v-else-if="error">{{ error }}</n-text>
        <n-empty size="huge" v-else> </n-empty>
      </n-spin>
    </n-card>
    <n-h2>loading: {{ loading }}</n-h2>
    <n-h2>isFinished: {{ isFinished }}</n-h2>
  </n-el>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { Faker, zh_CN } from "@faker-js/faker";
import {
  NEl,
  NSpin,
  NButton,
  NEmpty,
  NText,
  NCard,
  NH2,
  useMessage,
} from "naive-ui";

const faker = new Faker({ locale: [zh_CN] });

interface IResult {
  code: number;
  msg: string;
  data: {
    age: number;
    name: string;
  }[];
}

const service = (): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    // 模拟50%的失败率来演示错误处理
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: [
            {
              age: faker.number.int({ min: 20, max: 35 }),
              name: `范${faker.person.firstName()}`,
            },
            {
              age: faker.number.int({ min: 20, max: 35 }),
              name: `范${faker.person.firstName()}`,
            },
          ],
        });
      } else {
        reject(new Error("模拟接口错误"));
      }
    }, 1200);
  });
};

const message = useMessage();

const { data, res, error, loading, run, cancel, refresh, isFinished } =
  useRequest(service, {
    onSuccess() {
      console.log(res.value, data.value);
    },
    onError() {
      message.error(error.value.message);
    },
  });

function reload() {
  window.location.reload();
}
</script>
<style>
.box {
  padding: 40px;
}

.action {
  display: flex;
  column-gap: 10px;
  margin-bottom: 15px;
}
</style>
