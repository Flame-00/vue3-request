<template>
  <div class="container">
    <Form
      ref="formRef"
      :items
      :model
      :rules
      :grid="{
        yGap: 50,
      }"
    >
      <template #hobbies="{ value }">
        <n-form-item
          v-for="(item, index) in value"
          :key="item.id"
          :label="`爱好${index + 1}`"
          :path="`hobbies[${index}].hobby`"
          :rule="{
            required: true,
            message: `请输入爱好${index + 1}`,
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="item.hobby" />
          <n-button style="margin-left: 12px" @click="removeItem(index)">
            删除
          </n-button>
        </n-form-item>
      </template>
      <template #actions>
        <div style="display: flex; justify-content: flex-end">
          <n-button type="primary" @click="handleValidateButtonClick">
            验证
          </n-button>
        </div>
      </template>
    </Form>
    <n-button type="primary" @click="handleAddButtonClick"> 添加 </n-button>
    <pre>{{ JSON.stringify(model, null, 2) }}</pre>
  </div>
</template>

<script setup lang="tsx">
import { ref, useTemplateRef, computed, h } from "vue";
import {
  NCheckboxGroup,
  NCheckbox,
  NSpace,
  NInput,
  NRadioGroup,
  NRadio,
  NRadioButton,
  NFormItem,
  NButton,
} from "naive-ui";

import {
  Form,
  type BaseItem,
  type Item,
  type FormInst,
  type FormRules,
  type FormItemRule,
} from "./components/Form";

const formRef = useTemplateRef<FormInst>("formRef");

const model = ref({
  inputValue: null,
  textareaValue: null,
  selectValue: null,
  multipleSelectValue: null,
  datetimeValue: null,
  nestedValue: {
    path1: null,
    path2: null,
  },
  switchValue: false,
  checkboxGroupValue: null,
  radioGroupValue: null,
  inputNumberValue: null,
  timePickerValue: null,
  sliderValue: 0,
  transferValue: null,
  hobbies: [{ id: crypto.randomUUID(), hobby: "" }],
});

const rules: FormRules = {
  inputValue: {
    key: "inputValue",
    required: true,
    trigger: ["blur", "input"],
    message: "请输入 inputValue",
  },
  textareaValue: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入 textareaValue",
  },
  selectValue: {
    required: true,
    trigger: ["blur", "change"],
    message: "请选择 selectValue",
  },
  multipleSelectValue: {
    type: "array",
    required: true,
    trigger: ["blur", "change"],
    message: "请选择 multipleSelectValue",
  },
  datetimeValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "请输入 datetimeValue",
  },
  nestedValue: {
    path1: {
      required: true,
      trigger: ["blur", "input"],
      message: "请输入 nestedValue.path1",
    },
    path2: {
      required: true,
      trigger: ["blur", "change"],
      message: "请输入 nestedValue.path2",
    },
  },
  checkboxGroupValue: {
    type: "array",
    required: true,
    trigger: "change",
    message: "请选择 checkboxGroupValue",
  },
  radioGroupValue: {
    required: true,
    trigger: "change",
    message: "请选择 radioGroupValue",
  },
  radioButtonGroupValue: {
    required: true,
    trigger: "change",
    message: "请选择 radioButtonGroupValue",
  },
  inputNumberValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "请输入 inputNumberValue",
  },
  timePickerValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "请输入 timePickerValue",
  },
  sliderValue: {
    validator(rule: FormItemRule, value: number) {
      return value > 50;
    },
    trigger: ["blur", "change"],
    message: "sliderValue 需要大于 50",
  },
  transferValue: {
    type: "array",
    required: true,
    trigger: "change",
    message: "请输入 transferValue",
  },
};

const generalOptions = ["groode", "veli good", "emazing", "lidiculous"].map(
  (v) => ({
    label: v,
    value: v,
  })
);
const nestedOptions = [
  {
    label: "groode",
    value: "groode",
    children: [
      {
        label: "veli good",
        value: "veli good",
      },
    ],
  },
];

function removeItem(index: number) {
  model.value.hobbies.splice(index, 1);
}

const hobbies: BaseItem<{ id: string; hobby: string }[]> = {
  path: "hobbies",
  span: 24,
  isFormItem: false,
  render: (scope) => (
    console.log("scope", scope),
    (
      <>
        {scope.value.map((item: any, index: number) => (
          <NFormItem
            key={item.id}
            label={`爱好${index + 1}`}
            path={`hobbies[${index}].hobby`}
            rule={{
              required: true,
              message: `请输入爱好${index + 1}`,
              trigger: ["input", "blur"],
            }}
          >
            <NInput v-model:value={item.hobby} />
            <NButton
              style="margin-left: 12px"
              onClick={() => removeItem(index)}
            >
              删除
            </NButton>
          </NFormItem>
        ))}
      </>
    )
  ),
};

const items = computed<Item[]>(() => {
  return [
    // hobbies,
    {
      path: "hobbies",
      span: 24,
    },
    {
      label: "Input",
      path: "inputValue",
      type: () => h(NInput),
      span: 12,
      props: {
        placeholder: "Input",
      },
    },
    {
      label: "Textarea",
      path: "textareaValue",
      type: "input",
      props: {
        type: "textarea",
        placeholder: "Textarea",
        autosize: {
          minRows: 3,
          maxRows: 5,
        },
      },
    },
    {
      label: "Select",
      path: "selectValue",
      type: "select",
      span: 12,
      props: {
        options: generalOptions,
        placeholder: "Select",
      },
    },
    {
      label: "Multiple Select",
      path: "multipleSelectValue",
      span: 12,
      type: "select",
      props: {
        placeholder: "Select",
        options: generalOptions,
        multiple: true,
      },
    },
    {
      label: "Datetime",
      path: "datetimeValue",
      type: "date-picker",
      span: 12,
      hidden: model.value.switchValue,
      props: {
        type: "datetime",
      },
    },
    {
      label: "Switch",
      path: "switchValue",
      type: "switch",
      span: 12,
    },
    {
      label: "Checkbox Group",
      path: "checkboxGroupValue",
      span: 12,
      render: () => (
        <NCheckboxGroup v-model:value={model.value.checkboxGroupValue}>
          <NSpace>
            <NCheckbox value="Option 1">Option 1</NCheckbox>
            <NCheckbox value="Option 2">Option 2</NCheckbox>
            <NCheckbox value="Option 3">Option 3</NCheckbox>
          </NSpace>
        </NCheckboxGroup>
      ),
    },
    {
      label: "Radio Group",
      path: "radioGroupValue",
      render: () => (
        <NRadioGroup v-model:value={model.value.radioGroupValue}>
          <NSpace>
            <NRadio value="Option 1">Option 1</NRadio>
            <NRadio value="Option 2">Option 2</NRadio>
            <NRadio value="Option 3">Option 3</NRadio>
          </NSpace>
        </NRadioGroup>
      ),
      span: 12,
    },
    {
      label: "Radio Button Group",
      path: "radioGroupValue",

      render: () => (
        <NRadioGroup v-model:value={model.value.radioGroupValue}>
          <NRadioButton value="Option 1">Option 1</NRadioButton>
          <NRadioButton value="Option 2">Option 2</NRadioButton>
          <NRadioButton value="Option 3">Option 3</NRadioButton>
        </NRadioGroup>
      ),
      span: 12,
    },
    {
      label: "Input Number",
      path: "inputNumberValue",
      type: "input-number",
      span: 12,
    },
    {
      label: "Time Picker",
      path: "timePickerValue",
      type: "time-picker",
      span: 12,
    },
    {
      label: "Slider",
      path: "sliderValue",
      type: "slider",
      span: 12,
    },
    {
      label: "Transfer",
      path: "transferValue",
      type: "transfer",
      span: 14,
      props: {
        options: generalOptions,
      },
    },
    {
      label: "Nested Path",
      path: "nestedValue.path1",
      type: "cascader",
      span: 5,
      props: {
        placeholder: "Nested Path 1",
        options: nestedOptions,
      },
    },
    {
      label: "Nested Path 2",
      path: "nestedValue.path2",
      type: "select",
      span: 5,
      props: {
        options: generalOptions,
        placeholder: "Nested Path 2",
      },
    },
  ];
});
async function handleValidateButtonClick() {
  const res = await formRef.value?.validate();
  console.log(res);
}

function handleAddButtonClick() {
  model.value.hobbies.push({ id: crypto.randomUUID(), hobby: "" });
}
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 50px auto;
  display: flex;
  gap: 20px;
}
</style>
