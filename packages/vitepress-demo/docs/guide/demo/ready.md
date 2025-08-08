# 依赖请求

通过 `ready` 参数控制请求的执行时机，实现条件请求和依赖管理

在实际开发中，某些请求需要依赖特定条件才能执行，比如等待用户登录、表单验证通过或者依赖其他数据加载完成。`useRequest` 提供的 `ready` 参数可以完美解决这类场景。

`ready` 参数支持两种类型：

- **ref**: `Ref<boolean>`
- **getter**: `() => boolean`

```ts
const isLoggedIn = ref(false);
const { data, isLoading } = useRequest(fetchUser, {
  ready: isLoggedIn, // 只有当用户已登录时才发起请求
});

const props = defineProps<{ isLoggedIn: boolean }>();
const { data, isLoading } = useRequest(fetchUser, {
  ready: () => props.isLoggedIn, // 只有当用户已登录时才发起请求
});
```

## 自动模式

在自动模式下，当 `ready` 从 `false` 变为 `true` 时，会自动发起请求：

:::demo

```vue
<template>
  <section>
    <n-card title="自动模式 - 登录后获取用户信息">
      <n-space vertical>
        <n-flex align="center">
          <n-text>登录状态：</n-text>
          <n-switch v-model:value="isLoggedIn" />
          <n-text :type="isLoggedIn ? 'success' : 'error'">
            {{ isLoggedIn ? "已登录" : "未登录" }}
          </n-text>
        </n-flex>

        <n-alert v-if="!isLoggedIn" type="warning">
          请先登录，系统会自动加载用户信息
        </n-alert>

        <n-spin :show="isLoading">
          <n-flex :wrap="false" v-if="data">
            <n-image
              width="256"
              height="256"
              show-toolbar-tooltip
              :src="data.data.avatar"
            />
            <n-flex vertical justify="space-between">
              <div>
                <n-flex>
                  <n-text italic> id: </n-text>
                  <n-text depth="3"> {{ data.data.id }} </n-text>
                </n-flex>
                <n-flex>
                  <n-text italic> name: </n-text>
                  <n-text depth="3"> {{ data.data.name }} </n-text>
                </n-flex>
                <n-flex>
                  <n-text italic> age: </n-text>
                  <n-text depth="3"> {{ data.data.age }} </n-text>
                </n-flex>
                <n-flex>
                  <n-text italic> sex: </n-text>
                  <n-text depth="3"> {{ data.data.sex }} </n-text>
                </n-flex>
              </div>
              <n-tag type="success" style="align-self: flex-start;">
                自动加载完成
              </n-tag>
            </n-flex>
          </n-flex>
          <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
          <n-empty size="huge" v-else-if="!isLoggedIn" description="请先登录" />
          <n-empty size="huge" v-else description="加载中..." />
        </n-spin>
      </n-space>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref, watch } from "vue";
import {
  NCard,
  NSpin,
  NEmpty,
  NSpace,
  NFlex,
  NText,
  NSwitch,
  NAlert,
  NTag,
  NImage,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

interface IResult {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    avatar: string;
    age: number;
    sex: string;
  };
}

const message = useMessage();
const isLoggedIn = ref(false);

const getUserInfo = (): Promise<IResult> => {
  return new Promise((resolve) => {
    const random = Math.random() > 0.5 ? "female" : "male";
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName({
            sex: random,
          }),
          avatar: faker.image.personPortrait({
            sex: random,
            size: 256,
          }),
          sex: random,
          age: faker.number.int({
            min: 18,
            max: 35,
          }),
        },
      });
    }, 1000);
  });
};

// 自动模式：ready 变为 true 时自动请求
const { data, error, isLoading, mutate } = useRequest(getUserInfo, {
  ready: isLoggedIn,
  onSuccess: () => {
    message.success("用户信息加载成功");
  },
  // manual: false (默认值)
});

// 监听登录状态，登出时清空数据
watch(isLoggedIn, (newValue) => {
  if (!newValue) {
    mutate(undefined);
  }
});
</script>
```

:::

## 手动模式 (manual: true)

在手动模式下，即使 `ready` 为 `true`，也需要手动调用 `run` 才能执行。但如果 `ready` 为 `false`，则无法执行请求。

### 场景 1：手动依赖请求

以下示例展示了获取用户信息后查看订单记录的简单场景：

:::demo

```vue
<template>
  <section>
    <n-card title="手动模式 - 用户信息与订单">
      <n-space vertical>
        <n-space>
          <n-button type="primary" @click="getUser" :loading="userLoading">
            获取用户信息
          </n-button>
          <n-button
            type="success"
            @click="getOrders"
            :loading="orderLoading"
            :disabled="!userData"
          >
            查看订单
          </n-button>
          <n-button @click="clearAll"> 清空数据 </n-button>
        </n-space>

        <n-alert v-if="!userData" type="info">
          请先获取用户信息，然后才能查看订单记录
        </n-alert>

        <n-grid :cols="2" :x-gap="12">
          <!-- 用户信息 -->
          <n-grid-item>
            <n-card title="用户信息" size="small">
              <n-spin :show="userLoading">
                <div v-if="userData">
                  <n-descriptions :column="1" size="small">
                    <n-descriptions-item label="用户ID">{{
                      userData.data.id
                    }}</n-descriptions-item>
                    <n-descriptions-item label="用户名">{{
                      userData.data.name
                    }}</n-descriptions-item>
                    <n-descriptions-item label="邮箱">{{
                      userData.data.email
                    }}</n-descriptions-item>
                  </n-descriptions>
                </div>
                <n-empty
                  v-else
                  description="点击按钮获取用户信息"
                  size="small"
                />
              </n-spin>
            </n-card>
          </n-grid-item>

          <!-- 订单记录 -->
          <n-grid-item>
            <n-card title="订单记录" size="small">
              <n-spin :show="orderLoading">
                <div v-if="orderData?.data">
                  <n-list size="small">
                    <n-list-item
                      v-for="order in orderData.data"
                      :key="order.id"
                    >
                      <n-thing>
                        <template #header>订单 #{{ order.orderNo }}</template>
                        <template #description>
                          <n-text depth="3"
                            >{{ order.product }} - ¥{{ order.amount }}</n-text
                          >
                        </template>
                        <template #footer>
                          <n-tag
                            :type="
                              order.status === '已完成' ? 'success' : 'warning'
                            "
                            size="small"
                          >
                            {{ order.status }}
                          </n-tag>
                        </template>
                      </n-thing>
                    </n-list-item>
                  </n-list>
                </div>
                <n-empty v-else description="请先获取用户信息" size="small" />
              </n-spin>
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref, computed, watch } from "vue";
import {
  NCard,
  NSpin,
  NEmpty,
  NSpace,
  NButton,
  NAlert,
  NGrid,
  NGridItem,
  NDescriptions,
  NDescriptionsItem,
  NList,
  NListItem,
  NThing,
  NText,
  NTag,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  orderNo: string;
  product: string;
  amount: number;
  status: string;
}

interface UserResponse {
  code: number;
  msg: string;
  data: User;
}

interface OrderResponse {
  code: number;
  msg: string;
  data: Order[];
}

const message = useMessage();

// 获取用户信息
const fetchUser = (): Promise<UserResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
        data: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
      });
    }, 800);
  });
};

// 根据用户ID获取订单
const fetchOrders = (userId: string): Promise<OrderResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = Array.from({ length: 3 }, () => ({
        id: faker.string.uuid(),
        orderNo: faker.string.numeric(6),
        product: faker.commerce.productName(),
        amount: parseInt(faker.commerce.price({ min: 50, max: 500 })),
        status: faker.helpers.arrayElement(["已完成", "处理中", "待支付"]),
      }));

      resolve({
        code: 200,
        msg: "success",
        data: orders,
      });
    }, 600);
  });
};

// 第一个请求：获取用户信息
const {
  data: userData,
  isLoading: userLoading,
  run: getUser,
  mutate: mutateUser,
} = useRequest(fetchUser, {
  manual: true,
  onSuccess: () => {
    message.success("用户信息获取成功");
  },
});

// 第二个请求：获取订单（依赖用户信息）
const hasUser = computed(() => !!userData.value?.data?.id);

const {
  data: orderData,
  isLoading: orderLoading,
  run: getOrders,
  mutate: mutateOrders,
} = useRequest(() => fetchOrders(userData.value!.data.id), {
  manual: true,
  ready: hasUser,
  onSuccess: () => {
    message.success("订单数据获取成功");
  },
});

// 清空所有数据
const clearAll = () => {
  mutateUser(undefined);
  mutateOrders(undefined);
  message.info("数据已清空");
};

// 监听用户数据变化
watch(userData, (newValue) => {
  if (!newValue) {
    mutateOrders(undefined);
  }
});
</script>
```

:::

## 使用场景

`ready` 参数在以下场景中特别有用：

- **🔐 权限控制**: 根据用户角色或权限状态控制请求执行
- **🔗 依赖加载**: 等待依赖数据加载完成后再发起请求
- **✅ 表单验证**: 表单验证通过后才允许提交
- **🔍 条件查询**: 搜索关键词达到最小长度要求时才执行查询
- **👤 登录状态**: 用户登录后自动获取个人信息
- **📊 数据联动**: 基于上级选择结果加载下级数据

通过合理使用 `ready` 参数，你可以精确控制请求的执行时机，避免无效请求，提升应用性能和用户体验。
