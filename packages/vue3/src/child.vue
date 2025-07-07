<template>
    <input class="ipt" type="text" placeholder="搜索城市天气" v-model="city" />
    <Button type="primary" @click="() => search(city)">查询</Button>
    <section>
        <h3>axios</h3>
        <Loading v-if="isLoading" />
        <pre v-if="cityData && isFinished">{{ cityData?.data.data }}</pre>
        <pre v-if="error">{{ error }}</pre>
    </section>
</template>
<script setup lang="ts">
import { useAsyncHandler } from "@async-handler/request/useAsyncHandler";
import axios from "axios";
import { ref } from "vue";
import Loading from "./../../vitepress-demo/docs/components/Loading.vue";
import Button from "./../../vitepress-demo/docs/components/Button.vue";

const city = ref("");

// 请求接口示例
const url = "https://v2.xxapi.cn/api/weather";

// axios
const normalObj = ref({ a: 123 });
interface ICity {
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
        }[];
    };
    request_id: string;
}

const testService = (city: string): Promise<ICity> => {
    const testUrl = `https://v2.xxapi.cn/api/weather${Math.random() > 0.5 ? "" : "error"}`;
    return axios.get(testUrl, {
        params: {
            city: city || "杭州市",
        },
    });
};

const {
    run: search,
    data: cityData,
    error,
    isLoading,
    isFinished
} = useAsyncHandler(() => testService, {
    manual: true,
    onSuccess: (data, params) => {
        console.log(data, params);
    },
    onError: (error, params) => {
        console.log(error, params);
    }
});


</script>