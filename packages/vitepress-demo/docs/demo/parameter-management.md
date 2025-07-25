# 参数管理

`useRequest` 提供了完善的参数管理机制，让你能够灵活地处理请求参数，并在整个请求生命周期中追踪参数状态。

## 核心概念

### 📦 参数记录机制

`useRequest` 返回的 `params` 会自动记录当次调用 `service` 的参数数组。例如：

- 调用 `run(1, 2, 3)` → `params` 值为 `[1, 2, 3]`
- 调用 `run('hello', { id: 1 })` → `params` 值为 `['hello', { id: 1 }]`

### 🔄 生命周期参数传递

在所有[生命周期](./lifecycle.md)回调中，都会提供 `params` 参数：

- **`onBefore`**：请求发起前触发，可获取即将发送的参数
- **`onSuccess`**：请求成功时触发，可获取成功请求的参数
- **`onError`**：请求失败时触发，可获取失败请求的参数
- **`onFinally`**：请求完成时触发，无论成功失败都可获取参数

## 示例

`useRequest` 提供了多种参数设置方式，适应不同的业务场景。

### 🎯 方式一：默认参数 + 动态传参（推荐）

这是最灵活的参数管理方式，结合了默认参数和动态传参的优势：

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-input type="text" placeholder="输入姓氏" v-model:value="lastName" />
      <n-button type="primary" @click="() => run(lastName)">
        Add the surname
      </n-button>
    </n-flex>
    <hr />
    <n-spin :show="isLoading">
      <n-empty size="huge" v-if="!error && !data" />
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <pre v-else>{{ data }}</pre>
    </n-spin>
    <hr />
    <h3>params: {{ params }}</h3>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import {
  NSpin,
  NButton,
  NInput,
  NEmpty,
  NFlex,
  NText,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

interface IResult {
  code: number;
  msg: string;
  data: string;
}

const message = useMessage();
const lastName = ref("范");

const testService = (lastName: string): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: `${lastName}${faker.person.firstName()}`,
        });
      } else {
        reject(new Error("Failed to generate full name!"));
      }
    }, 1000);
  });
};

const { run, data, params, error, isLoading } = useRequest(testService, {
  defaultParams: ["林"], // 自动执行时使用默认姓氏 // [!code ++]
});
</script>
```

:::

- ✅ **动态传参**：通过 `run(newParams)` 可随时传入新参数
- ✅ **参数记录**：所有参数变化都会被 `params` 准确记录
- ✅ **类型安全**：享受完整的 TypeScript 类型提示

### 🏭 方式二：工厂函数模式

通过工厂函数包装 service，适用于需要对参数进行预处理的场景：

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-input type="text" placeholder="输入姓氏" v-model:value="lastName" />
      <n-button type="primary" @click="onClick"> Add the surname </n-button>
    </n-flex>
    <hr />
    <n-spin :show="isLoading">
      <n-empty size="huge" v-if="!error && !data" />
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <pre v-else>{{ data }}</pre>
    </n-spin>
    <hr />
    <h3>params: {{ params }}</h3>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import {
  NSpin,
  NButton,
  NInput,
  NEmpty,
  NFlex,
  NText,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

interface IResult {
  code: number;
  msg: string;
  data: string;
}

const message = useMessage();
const lastName = ref("范");

const testService = (lastName: string): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: `${lastName}${faker.person.firstName()}`,
        });
      } else {
        reject(new Error("Failed to generate full name!"));
      }
    }, 1000);
  });
};

const { run, data, params, error, isLoading } = useRequest(
  (lastName: string) => {
    // 🏭 在工厂函数中可以对参数进行预处理 // [!code highlight]
    if (!lastName) {
      throw new Error("The surname cannot be left blank.");
    }
    return testService(lastName);
  },
  {
    manual: true,
    onSuccess: (data, params) => {
      message.success(`params -> "${params}"`);
    },
    onError: (error, params) => {
      message.error(error.message);
    },
  }
);
const onClick = async () => {
  run(lastName.value); // 享受完整的 TypeScript 类型提示 // [!code highlight]
};
</script>
```

:::

- ✅ **预处理**：需要对参数进行预处理或验证
- ✅ **复用**：多个地方使用相同的参数处理逻辑

### ❌ 方式三：闭包模式（不推荐）

将参数封装在闭包中，**存在多个严重缺陷，强烈不推荐使用**：

:::demo

```vue
<template>
  <section>
    <div class="warning-banner">
      ⚠️ 此示例仅用于展示闭包模式的缺陷，请勿在实际项目中使用
    </div>
    <n-flex>
      <n-input type="text" placeholder="输入姓氏" v-model:value="lastName" />
      <n-button type="primary" @click="onClick"> Add the surname </n-button>
    </n-flex>
    <hr />
    <n-spin :show="isLoading">
      <n-empty size="huge" v-if="!error && !data" />
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <pre v-else>{{ data }}</pre>
    </n-spin>
    <h4 class="params-display">
      <span class="label">⚠️ 参数记录异常:</span>
      <span class="params-value">{{ params }}</span>
      <span class="note"
        >（注意：params 始终为 []，无法追踪真实参数 "{{ lastName }}"）</span
      >
    </h4>
    <div class="defects-list">
      <h5>🚨 当前示例展示的缺陷：</h5>
      <ul>
        <li>❌ 修改输入框后点击按钮，发现 params 始终为 []</li>
        <li>❌ run() 方法无法接收参数，失去了灵活性</li>
        <li>❌ 实际使用的参数 "{{ lastName }}" 和记录的 params 不一致</li>
        <li>❌ 调试时无法通过 params 了解真实的请求参数</li>
      </ul>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "@async-handler/request/vue3-request";
import { ref } from "vue";
import {
  NSpin,
  NButton,
  NInput,
  NEmpty,
  NFlex,
  NText,
  useMessage,
} from "naive-ui";
import faker from "@/utils/faker";

interface IResult {
  code: number;
  msg: string;
  data: string;
}

const message = useMessage();
const lastName = ref("");

const testService = (lastName: string): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    console.log("实际接收到的参数:", lastName);
    setTimeout(() => {
      // 模拟50%的几率出错
      if (Math.random() > 0.5) {
        resolve({
          code: 200,
          msg: "success",
          data: `${lastName}${faker.person.firstName()}`,
        });
      } else {
        reject(new Error("Failed to generate full name!"));
      }
    }, 1000);
  });
};

// ❌ 闭包模式 - 参数通过闭包捕获，导致 params 记录失效
const { run, data, params, error, isLoading } = useRequest(
  () => testService(lastName.value), // 参数通过闭包传递，useRequest 无法感知 // [!code highlight]
  {
    manual: true,
    onFinally: (params, data, error) => {
      // ⚠️ 这里的 params 始终为空数组 []，无法获取真实参数 // [!code highlight]
      message.info(
        `useReques收到的params -> "${params}", 实际使用的params -> "${lastName.value}"`
      );
      if (data) {
        message.success(`params -> "${params}"`);
      }
      if (error) {
        message.error(error.message);
      }
    },
  }
);

const onClick = () => {
  run(); // ❌ 无法传递参数，run() 方法失去了动态传参的能力 // [!code highlight]
};
</script>
<style scoped>
.warning-banner {
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-weight: 500;
  text-align: center;
}
.params-display {
  background: var(--vp-c-danger-soft);
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin: 16px 0;
}
.params-display .label {
  font-weight: 600;
  color: var(--vp-c-danger-1);
}
.params-display .params-value {
  font-family: monospace;
  background: var(--vp-c-bg);
  padding: 2px 6px;
  border-radius: 3px;
  margin: 0 8px;
}
.params-display .note {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-style: italic;
}
.defects-list {
  background: var(--vp-c-bg-soft);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}
.defects-list h5 {
  margin: 0 0 12px 0;
  color: var(--vp-c-danger-1);
}
.defects-list ul {
  margin: 0;
  padding-left: 20px;
}
.defects-list li {
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style>
```

:::

**严重缺陷分析：**

1. **❌ 参数记录失效**

   ```ts
   // params 始终为空数组，无法追踪真实参数
   console.log(params.value); // 输出: []
   ```

2. **❌ 失去动态传参能力**

   ```ts
   run(); // 只能这样调用，无法传入新参数
   run(newForm); // ❌ 传入的参数会被忽略
   ```

3. **❌ 测试困难**

   ```ts
   // 测试时无法 mock 参数，依赖外部变量
   const mockForm = { name: "test", age: 25 };
   run(mockForm); // ❌ 无效，仍使用闭包中的 form
   ```

4. **❌ 副作用难以控制**

   ```ts
   // form 的变化不会触发重新请求，但会影响请求结果
   form.name = "new name"; // 静默影响下次请求
   ```

5. **❌ TypeScript 类型提示缺失**
   ```ts
   run(/* 这里无法获得类型提示 */);
   ```
