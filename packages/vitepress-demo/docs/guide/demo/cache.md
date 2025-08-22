# 缓存 & SWR

通过设置 `options.cacheKey`，`useRequest` 会将当前请求成功的数据缓存起来。下次组件初始化时，如果有缓存数据，我们会优先返回缓存数据，然后在背后发送新请求，也就是 SWR 的能力。

你可以通过 `options.staleTime` 设置数据保持新鲜时间，在该时间内，我们认为数据是新鲜的，不会重新发起请求。

你也可以通过 `options.cacheTime` 设置数据缓存时间，超过该时间，我们会清空该条缓存数据。

## SWR

下面的示例，我们设置了 `cacheKey`，在组件重新加载时，会优先返回缓存的内容，然后在背后重新发起请求。你可以通过点击按钮来体验效果。`

:::demo

```vue
<template>
  <section>
    <n-button type="primary" ghost @click="showComponents = !showComponents">
      {{
        showComponents ? "Destroy child component" : "Create child component"
      }}
    </n-button>

    <div v-if="showComponents">
      <A />
      <hr />
      <B />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

const showComponents = ref(true);

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  return new Promise((resolve) => {
    const gender = Math.random() > 0.5 ? "female" : "male";

    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({ sex: gender }),
          email: faker.internet.email(),
          avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
          department: faker.helpers.arrayElement([
            "技术部",
            "产品部",
            "运营部",
            "设计部",
            "市场部",
          ]),

          roles: faker.helpers.arrayElement(["admin", "user"]),
        },
      });
    }, 1000);
  });
};

function createUserComponent(hasCache: boolean) {
  return {
    setup() {
      const { data, loading } = useRequest(service, {
        ...(hasCache && {
          cacheKey: "cacheKey-demo", // [!code highlight]
        }),
      });

      return () => {
        return h("div", [
          h("h3", hasCache ? "Cached" : "Not cached"),
          h(
            NSpin,
            {
              show: data.value === undefined && loading.value,
            },
            () => [
              data.value &&
                h(NFlex, { wrap: false }, () => [
                  h(NImage, {
                    showToolbarTooltip: true,
                    src: data.value.data.avatar,
                  }),
                  h("div", null, [
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "姓名:"),
                      h(NText, { depth: 3 }, () => data.value.data.name),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "邮箱:"),
                      h(NText, { depth: 3 }, () => data.value.data.email),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "部门:"),
                      h(NText, { depth: 3 }, () => data.value.data.department),
                    ]),

                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "身份:"),
                      h(NText, { depth: 3 }, () => data.value.data.roles),
                    ]),
                  ]),
                ]),
              !data.value &&
                h(NEmpty, {
                  size: "huge",
                }),
            ]
          ),
        ]);
      };
    },
  };
}

const A = createUserComponent(true); // 有缓存
const B = createUserComponent(false); // 无缓存
</script>
```

:::

## 共享

当拥有相同的 `cacheKey` 时， 同时只会有一个在发起请求，后发起的将会共用同一个请求

当某个 `cacheKey` 发起请求时，其它相同 `cacheKey` 的内容均会随之同步

:::tip
打开控制台 然后分别点击 `Run` 按钮， 查看 `console.log` 的打印
:::

:::demo

```vue
<template>
  <section>
    <A />
    <hr />
    <B />
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  console.log("[service] 只会打印一次");
  return new Promise((resolve) => {
    const gender = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({ sex: gender }),
          email: faker.internet.email(),
          avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
          department: faker.helpers.arrayElement([
            "技术部",
            "产品部",
            "运营部",
            "设计部",
            "市场部",
          ]),

          roles: faker.helpers.arrayElement(["admin", "user"]),
        },
      });
    }, 2000);
  });
};

function createUserComponent(title: string) {
  return {
    setup() {
      const { data, loading, run } = useRequest(service, {
        cacheKey: "cacheKey-share", // [!code highlight]
      });

      return () => {
        return h("div", [
          h("h3", title),
          h(
            NButton,
            {
              type: "primary",
              ghost: true,
              style: {
                margin: "5px 0",
              },
              onClick: run,
            },
            () => "Run"
          ),
          h(
            NSpin,
            {
              show: loading.value,
            },
            () => [
              data.value &&
                h(NFlex, { wrap: false }, () => [
                  h(NImage, {
                    showToolbarTooltip: true,
                    src: data.value.data.avatar,
                  }),
                  h("div", null, [
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "姓名:"),
                      h(NText, { depth: 3 }, () => data.value.data.name),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "邮箱:"),
                      h(NText, { depth: 3 }, () => data.value.data.email),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "部门:"),
                      h(NText, { depth: 3 }, () => data.value.data.department),
                    ]),

                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "身份:"),
                      h(NText, { depth: 3 }, () => data.value.data.roles),
                    ]),
                  ]),
                ]),
              !data.value &&
                h(NEmpty, {
                  size: "huge",
                }),
            ]
          ),
        ]);
      };
    },
  };
}

const A = createUserComponent("Component-A");
const B = createUserComponent("Component-B");
</script>
```

:::

## 缓存时间

可以通过 `cacheTime` 设置缓存的回收时间，当缓存数据的时间超过了设定的 `cacheTime` （默认为 300000 毫秒，即 5 分钟），`VueRequest` 会自动丢弃该缓存的数据，等到下次发起请求后，重新缓存新的数据。

:::demo

```vue
<template>
  <section>
    <n-button type="primary" ghost @click="showComponents = !showComponents">
      {{
        showComponents ? "Destroy child component" : "Create child component"
      }}
    </n-button>

    <div v-if="showComponents">
      <Component />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

const showComponents = ref(true);

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  return new Promise((resolve) => {
    const gender = Math.random() > 0.5 ? "female" : "male";

    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({ sex: gender }),
          email: faker.internet.email(),
          avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
          department: faker.helpers.arrayElement([
            "技术部",
            "产品部",
            "运营部",
            "设计部",
            "市场部",
          ]),

          roles: faker.helpers.arrayElement(["admin", "user"]),
        },
      });
    }, 1000);
  });
};

function createUserComponent() {
  return {
    setup() {
      const { data, loading } = useRequest(service, {
        cacheKey: "cacheTime-demo",
        cacheTime: 5000, // [!code highlight]
      });

      return () => {
        return h("div", [
          h("h3", "Cached"),
          h(
            NSpin,
            {
              show: data.value === undefined && loading.value,
            },
            () => [
              data.value &&
                h(NFlex, { wrap: false }, () => [
                  h(NImage, {
                    showToolbarTooltip: true,
                    src: data.value.data.avatar,
                  }),
                  h("div", null, [
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "姓名:"),
                      h(NText, { depth: 3 }, () => data.value.data.name),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "邮箱:"),
                      h(NText, { depth: 3 }, () => data.value.data.email),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "部门:"),
                      h(NText, { depth: 3 }, () => data.value.data.department),
                    ]),

                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "身份:"),
                      h(NText, { depth: 3 }, () => data.value.data.roles),
                    ]),
                  ]),
                ]),
              !data.value &&
                h(NEmpty, {
                  size: "huge",
                }),
            ]
          ),
        ]);
      };
    },
  };
}

const Component = createUserComponent();
</script>
```

:::

## 保鲜时间

如果你能确保缓存下来的数据，在一定时间内不会有任何更新的，你可以设置一个保鲜时间 `staleTime` （默认为 0，即不保鲜）, 当设置保鲜时间后，`VueRequest` 在该时间内会认为缓存的数据是新鲜的，从而不会发起新的请求，这能为一些定时更新的接口减轻请求的压力。

:::demo

```vue
<template>
  <section>
    <n-button type="primary" ghost @click="showComponents = !showComponents">
      {{
        showComponents ? "Destroy child component" : "Create child component"
      }}
    </n-button>

    <div v-if="showComponents">
      <Component />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

const showComponents = ref(true);

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  return new Promise((resolve) => {
    const gender = Math.random() > 0.5 ? "female" : "male";

    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({ sex: gender }),
          email: faker.internet.email(),
          avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
          department: faker.helpers.arrayElement([
            "技术部",
            "产品部",
            "运营部",
            "设计部",
            "市场部",
          ]),

          roles: faker.helpers.arrayElement(["admin", "user"]),
        },
      });
    }, 1000);
  });
};

function createUserComponent() {
  return {
    setup() {
      const { data, loading } = useRequest(service, {
        cacheKey: "staleTime-demo",
        staleTime: 5000, // [!code highlight]
      });

      return () => {
        return h("div", [
          h("h3", "Cached"),
          h(
            NSpin,
            {
              show: data.value === undefined && loading.value,
            },
            () => [
              data.value &&
                h(NFlex, { wrap: false }, () => [
                  h(NImage, {
                    showToolbarTooltip: true,
                    src: data.value.data.avatar,
                  }),
                  h("div", null, [
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "姓名:"),
                      h(NText, { depth: 3 }, () => data.value.data.name),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "邮箱:"),
                      h(NText, { depth: 3 }, () => data.value.data.email),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "部门:"),
                      h(NText, { depth: 3 }, () => data.value.data.department),
                    ]),

                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "身份:"),
                      h(NText, { depth: 3 }, () => data.value.data.roles),
                    ]),
                  ]),
                ]),
              !data.value &&
                h(NEmpty, {
                  size: "huge",
                }),
            ]
          ),
        ]);
      };
    },
  };
}

const Component = createUserComponent();
</script>
```

:::

## 删除缓存

Vue3Request 提供了一个 `clearCache` 方法，可以清除指定 `cacheKey` 或者是所有的缓存数据。

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-button type="primary" ghost @click="showComponents = !showComponents">
        {{
          showComponents ? "Destroy child component" : "Create child component"
        }}
      </n-button>
      <n-button type="primary" @click="clearCache('Cache-A')">
        Clear Cache-A
      </n-button>
      <n-button type="primary" @click="clearCache('Cache-B')">
        Clear Cache-B
      </n-button>
      <n-button type="primary" @click="clearCache()"> Clear All </n-button>
    </n-flex>
    <div v-if="showComponents">
      <A />
      <hr />
      <B />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRequest, clearCache } from "@async-handler/request/vue3-request"; // [!code highlight]
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

const showComponents = ref(true);

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  return new Promise((resolve) => {
    const gender = Math.random() > 0.5 ? "female" : "male";

    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({ sex: gender }),
          email: faker.internet.email(),
          avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
          department: faker.helpers.arrayElement([
            "技术部",
            "产品部",
            "运营部",
            "设计部",
            "市场部",
          ]),

          roles: faker.helpers.arrayElement(["admin", "user"]),
        },
      });
    }, 1000);
  });
};

function createUserComponent(cacheKey: string) {
  return {
    setup() {
      const { data, loading } = useRequest(service, {
        cacheKey, // [!code highlight]
      });

      return () => {
        return h("div", [
          h("h3", cacheKey),
          h(
            NSpin,
            {
              show: data.value === undefined && loading.value,
            },
            () => [
              data.value &&
                h(NFlex, { wrap: false }, () => [
                  h(NImage, {
                    showToolbarTooltip: true,
                    src: data.value.data.avatar,
                  }),
                  h("div", null, [
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "姓名:"),
                      h(NText, { depth: 3 }, () => data.value.data.name),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "邮箱:"),
                      h(NText, { depth: 3 }, () => data.value.data.email),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "部门:"),
                      h(NText, { depth: 3 }, () => data.value.data.department),
                    ]),

                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "身份:"),
                      h(NText, { depth: 3 }, () => data.value.data.roles),
                    ]),
                  ]),
                ]),
              !data.value &&
                h(NEmpty, {
                  size: "huge",
                }),
            ]
          ),
        ]);
      };
    },
  };
}

const A = createUserComponent("Cache-A");
const B = createUserComponent("Cache-B");
</script>
```

:::

## 自定义缓存

通过配置 `options.setCache` 和 `options.getCache`，可以自定义数据缓存，比如可以将数据存储到 `localStorage`、`IndexDB` 等。

- `setCache` 和 `getCache` 需要配套使用。
- 在自定义缓存模式下，`staleTime`依旧可用，但是 `cacheTime` 和 `clearCache` 不会生效！请自行实现。

:::demo

```vue
<template>
  <section>
    <n-button type="primary" ghost @click="showComponents = !showComponents">
      {{
        showComponents ? "Destroy child component" : "Create child component"
      }}
    </n-button>

    <div v-if="showComponents">
      <Component />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { h, ref } from "vue";
import { NSpin, NButton, NEmpty, NFlex, NText, NImage } from "naive-ui";
import faker from "@/utils/faker";

const showComponents = ref(true);

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    roles: string;
  };
}

const service = (): Promise<IResult> => {
  return new Promise((resolve) => {
    const gender = Math.random() > 0.5 ? "female" : "male";

    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({ sex: gender }),
          email: faker.internet.email(),
          avatar: faker.image.personPortrait({ sex: gender, size: 128 }),
          department: faker.helpers.arrayElement([
            "技术部",
            "产品部",
            "运营部",
            "设计部",
            "市场部",
          ]),

          roles: faker.helpers.arrayElement(["admin", "user"]),
        },
      });
    }, 1000);
  });
};

function createUserComponent() {
  return {
    setup() {
      const { data, loading } = useRequest(service, {
        cacheKey: "customCacheKey-demo",
        setCache: (cacheKey, cacheData) => {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData)); // [!code highlight]
        },
        getCache: (cacheKey) => {
          return JSON.parse(localStorage.getItem(cacheKey) || "{}"); // [!code highlight]
        },
      });

      return () => {
        return h("div", [
          h("h3", "Cached"),
          h(
            NSpin,
            {
              show: data.value === undefined && loading.value,
            },
            () => [
              data.value &&
                h(NFlex, { wrap: false }, () => [
                  h(NImage, {
                    showToolbarTooltip: true,
                    src: data.value.data.avatar,
                  }),
                  h("div", null, [
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "姓名:"),
                      h(NText, { depth: 3 }, () => data.value.data.name),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "邮箱:"),
                      h(NText, { depth: 3 }, () => data.value.data.email),
                    ]),
                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "部门:"),
                      h(NText, { depth: 3 }, () => data.value.data.department),
                    ]),

                    h(NFlex, () => [
                      h(NText, { italic: true }, () => "身份:"),
                      h(NText, { depth: 3 }, () => data.value.data.roles),
                    ]),
                  ]),
                ]),
              !data.value &&
                h(NEmpty, {
                  size: "huge",
                }),
            ]
          ),
        ]);
      };
    },
  };
}

const Component = createUserComponent();
</script>
```

:::

## Options

| 参数      | 说明                                                                                                        | 类型                                                     | 默认值            |
| --------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------- |
| cacheKey  | 缓存的唯一标识，相同 `cacheKey` 的请求会共享缓存                                                            | `string`                                                 | -                 |
| cacheTime | 缓存数据回收时间，超过该时间会清除缓存（毫秒），如果设置为 `-1`，则表示缓存数据永不过期                     | `number`                                                 | `300000` (5 分钟) |
| staleTime | 数据保持新鲜时间，在该时间内认为数据是新鲜的，不会重新发起请求（毫秒），如果设置为 `-1`，则表示数据永远新鲜 | `number`                                                 | `0`               |
| setCache  | 自定义设置缓存                                                                                              | `(cacheKey: string, cacheData: CacheParamsType) => void` | -                 |
| getCache  | 自定义读取缓存                                                                                              | `(cacheKey: string) => CacheParamsType`                  | -                 |
