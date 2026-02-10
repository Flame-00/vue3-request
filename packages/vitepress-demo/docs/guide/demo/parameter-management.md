# 参数管理

`useRequest` 提供了完善的参数管理机制，让你能够灵活地处理请求参数，并在整个请求生命周期中追踪参数状态。

`useRequest` 返回的 `params` 会自动记录当次调用 `service` 的参数数组。例如：

- 调用 `run(1, 2, 3)` → `params` 值为 `[1, 2, 3]`
- 调用 `run('hello', { id: 1 })` → `params` 值为 `['hello', { id: 1 }]`

在所有[生命周期](./lifecycle.md)回调中，都会提供 `params` 参数。例如：

- `onBefore: (params) => {}`
- `onSuccess: (data, params) => {}`
- `onError: (error, params) => {}`
- `onFinally: (params, data, error) => {}`

## 参数设置

`useRequest` 提供了多种参数设置方式，适应不同的业务场景。

### 🎯 默认参数 + 动态传参（推荐）

这是最灵活的参数管理方式，结合了默认参数 `options.defaultParams` 和动态传参的优势：

- 通过 `run(newParams)` 可随时传入新参数
- 所有参数变化都会被 `params` 准确记录
- 享受完整的 TypeScript 类型提示

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
    <n-spin :show="loading">
      <pre v-if="data">{{ data }}</pre>
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <n-empty size="huge" v-else />
    </n-spin>
    <hr />
    <h3>params: {{ params }}</h3>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "vue3-request";
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

const service = (lastName: string): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
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

const { run, data, params, error, loading } = useRequest(service, {
  defaultParams: ["林"], // [!code highlight]
  onSuccess: (params) => {
    message.success(`params -> "${params}"`);
  },
  onError: (params) => {
    message.error(error.value?.message || '请求失败');
  },
});
</script>
```

:::

### 🏭 工厂函数模式

通过工厂函数包装 service，适用于需要对参数进行预处理的场景：

- 需要对参数进行预处理或验证
- 多个地方使用相同的参数处理逻辑

:::demo

```vue
<template>
  <section>
    <n-flex>
      <n-input type="text" placeholder="输入姓氏" v-model:value="lastName" />
      <n-button type="primary" @click="onClick"> Add the surname </n-button>
    </n-flex>
    <hr />
    <n-spin :show="loading">
      <pre v-if="data">{{ data }}</pre>
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <n-empty size="huge" v-else />
    </n-spin>
    <hr />
    <h3>params: {{ params }}</h3>
  </section>
</template>
<script setup lang="ts">
import { useRequest } from "vue3-request";
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

const service = (lastName: string): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
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

const { run, data, params, error, loading } = useRequest(
  (lastName: string) => {
    // 🏭 在工厂函数中可以对参数进行预处理 // [!code highlight]
    if (!lastName) {
      throw new Error("The surname cannot be left blank.");
    }
    return service(lastName);
  },
  {
    manual: true,
    onSuccess: (params) => {
      message.success(`params -> "${params}"`);
    },
    onError: (params) => {
      message.error(error.value?.message || '请求失败');
    },
  }
);
const onClick = async () => {
  run(lastName.value); // 享受完整的 TypeScript 类型提示 // [!code highlight]
};
</script>
```

:::

### ❌ 闭包模式（不推荐）

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
    <n-spin :show="loading">
      <pre v-if="data">{{ data }}</pre>
      <n-text type="error" v-else-if="error">{{ error.message }}</n-text>
      <n-empty size="huge" v-else />
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
import { useRequest } from "vue3-request";
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

const service = (lastName: string): Promise<IResult> => {
  return new Promise((resolve, reject) => {
    console.log("实际接收到的参数:", lastName);
    setTimeout(() => {
      // 模拟50%的失败率来演示错误处理
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
const { run, data, params, error, loading } = useRequest(
  () => service(lastName.value), // 参数通过闭包传递，useRequest 无法感知 // [!code highlight]
  {
    manual: true,
    onFinally: (params) => {
      // ⚠️ 这里的 params 始终为空数组 []，无法获取真实参数 // [!code highlight]
      message.info(
        `useRequest收到的params -> "${params}", 实际使用的params -> "${lastName.value}"`
      );
      // 使用 useRequest 返回的响应式 data 和 error
      if (data.value) {
        message.success(`请求成功`);
      }
      if (error.value) {
        message.error(error.value.message);
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

## Options

| 参数          | 说明                                                   | 类型 | 默认值 |
| ------------- | ------------------------------------------------------ | ---- | ------ |
| [defaultParams](/API/#defaultparams) | 默认参数数组，在自动模式下会作为初始参数传递给 Service | `P`  | `[]`   |

## Result

| 参数   | 说明                                                                                   | 类型     |
| ------ | -------------------------------------------------------------------------------------- | -------- |
| [params](/API/#params) | 当次执行的 Service 的参数数组。比如你触发了 `run(1, 2, 3)`，则 params 等于 `[1, 2, 3]` | `Ref<P>` |

## 贡献者 :shamrock:

<Team />