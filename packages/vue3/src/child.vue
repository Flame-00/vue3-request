<template>
  <input class="ipt" type="text" placeholder="搜索城市天气" v-model="city" />
  <Button type="primary" @click="onClick">查询</Button>
  <section>
    <Loading v-if="isLoading" />
    <pre v-if="cityData">{{ cityData?.data }}</pre>
    <pre v-if="error">{{ error }}</pre>
  </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@flame00/vue3-async-handler";
import axios from "axios";
import { ref } from "vue";
// import message from "@/utils/message";

const city = ref("");

// axios
interface ICity {
  data: {
    code: number;
    msg: string;
    data: {
      city: string;
      data: {
        date: string;
        temperature: string;
        weather: string;
        wind: string;
        air_quality: string;
      }[]
    };
    request_id: string;
  };
}

const testService = (city: string): Promise<ICity> => {
  const testUrl = `https://v2.xxapi.cn/api/weather${Math.random() > 0.5 ? "" : "error" // 模拟错误
    }`;
  return axios.get(testUrl, {
    params: {
      city: city || "杭州市",
    },
  });
};

const {
  runAsync,
  params,
  data: cityData,
  error,
  isLoading,
  isFinished,
} = useAsyncHandler(() => testService, {
  manual: true,
  onSuccess: (data, params) => {
    console.log(data, params);
    // message.success(`${data.data.msg}-----${params}`);
  },
  onError: (error, params) => {
    console.log(error, params);
    // message.error(`${error}-----${params}`);
  },
});

async function onClick() {
  try {
    const res = await runAsync(city.value) as ICity
    console.log(res.data.msg)
    // message.success(`${res.data.msg}-----${params.value}`);
  } catch (error) {
    console.log(error)
    // message.error(`${error}-----${params.value}`);
  }
}
</script>

<style></style>