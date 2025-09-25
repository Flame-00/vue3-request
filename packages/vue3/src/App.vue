<template>
  <div class="container">
    <n-button type="primary" @click="handleClick"> 点击</n-button>
    <NFormPro>
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
    </NFormPro>
    <n-button type="primary" @click="handleAddButtonClick"> 添加 </n-button>
    {{ testvalue }}
    <pre>{{ JSON.stringify(model, null, 2) }}</pre>
  </div>
</template>

<script setup lang="tsx">
import {
  ref,
  useTemplateRef,
  computed,
  h,
  defineComponent,
  reactive,
} from "vue";
import {
  NCheckboxGroup,
  NCheckbox,
  NSpace,
  NInput,
  NSelect,
  NRadioGroup,
  NRadio,
  NRadioButton,
  NFormItem,
  NButton,
  NDropdown,
  type SelectInst,
  type FormItemInst,
} from "naive-ui";

import {
  // NFormPro,
  type BaseItem,
  type Item,
  type FormInst,
  type FormRules,
  type FormItemRule,
} from "./components/Form";

import { useForm } from "./components/Form/useForm";

// 定义表单数据类型
interface FormModel {
  inputValue: null | string;
  textareaValue: null | string;
  selectValue: null | string | number;
  multipleSelectValue: null | (string | number)[];
  datetimeValue: null | number;
  nestedValue: {
    path1: null | string;
    path2: null | string;
  };
  switchValue: boolean;
  checkboxValue: boolean;
  checkboxGroupValue: null | (string | number)[];
  radioGroupValue: null | string | number;
  inputNumberValue: null | number;
  timePickerValue: null | number;
  sliderValue: number;
  transferValue: null | (string | number)[];
  hobbies: { id: string; hobby: string }[];
}

const testvalue = ref(null);

// const formRef = useTemplateRef<FormInst>("formRef");
const selectInstRef = ref<SelectInst | null>(null);
const model = ref<FormModel>({
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
  checkboxValue: false,
  checkboxGroupValue: null,
  radioGroupValue: null,
  inputNumberValue: null,
  timePickerValue: null,
  sliderValue: 0,
  transferValue: null,
  hobbies: [{ id: crypto.randomUUID(), hobby: "" }],
});
async function handleClick() {
  formItemRefSelect.value?.validate();
  formItemRefInput.value?.validate();
  // items.value[1].label = "666666";
}

const rules: FormRules = {
  inputValue: {
    key: "inputValue",
    required: true,
    trigger: ["blur", "input"],
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
    },
    path2: {
      required: true,
      trigger: ["blur", "change"],
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

const hobbies: BaseItem<FormModel, { id: string; hobby: string }[]> = {
  field: "hobbies",
  formItemGiProps: {
    span: 24,
  },
  defaultFormItem: false,
  render: (scope) => (
    <>
      {scope.value.map((item, index) => (
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
          <NButton style="margin-left: 12px" onClick={() => removeItem(index)}>
            删除
          </NButton>
        </NFormItem>
      ))}
    </>
  ),
};
const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: any = {};
  if (checked) {
    style.background = "#d03050";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

const formItemRefSelect = ref<FormItemInst | null>(null);
const formItemRefInput = ref<FormItemInst | null>(null);

const items = ref<Item<FormModel>[]>([
  // hobbies,
  {
    field: "hobbies",
    defaultFormItem: false,
    formItemGiProps: {
      span: 24,
    },

    // hide: model.value.switchValue,
  },
  {
    // render(scope) {
    //   console.log(scope);
    //   return <CheckboxComponent />;
    // },
    // vModelKey: "checked",
    // childrenOptions: [
    //   {
    //     tag: "checkbox",
    //     props: {
    //       label: "Option 1",
    //       value: "Option 1",
    //     },
    //   },
    // ],
    props: {
      name: "范德彪",
      age: 18,
    },
    field: "checkboxValue",
    type: "checkbox",
    formItemGiProps: {
      span: 12,
      label: "Checkbox",
    },
    slots: {
      default: () => "自然赠予你，树冠 微风 肩头的暴雨",
    },
  },
  {
    field: "inputValue",
    formItemGiProps: {
      label: "Input",
      span: 12,
      ref: formItemRefInput,
      feedbackStyle: "text-align: center;",
    },
    render(scope) {
      return <NInput />;
    },
    props: {
      placeholder: "Input",
      round: true,
    },
    slots: {
      suffix: () => h("h4", "元"),
    },
  },
  {
    field: "textareaValue",
    type: "input",
    formItemGiProps: {
      label: "Textarea",
      span: 12,
    },
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
    field: "selectValue",
    type: "select",
    formItemGiProps: {
      label: "Select",
      span: 12,
      ref: (instance) => {
        formItemRefSelect.value = instance;
      },
    },
    props: {
      options: generalOptions,
      placeholder: "Select",
      // ref: selectRef,
    },

    slots: {
      header: () => "不知道放些什么",
      action: () => "如果你点开了这个例子，你可能需要它",
    },
  },
  {
    field: "multipleSelectValue",
    formItemGiProps: {
      label: "Multiple Select",
      span: 12,
    },
    type: "select",
    props: {
      placeholder: "Select",
      options: generalOptions,
      multiple: true,
    },
  },
  {
    field: "datetimeValue",
    type: "date-picker",
    formItemGiProps: {
      label: "Datetime",
      span: 12,
    },

    props: {
      type: "datetime",
    },
  },
  {
    field: "switchValue",
    type: "switch",
    formItemGiProps: {
      label: "Switch",
      span: 12,
    },
    props: {
      "onUpdate:value": (value: boolean) => {
        console.log("Switch", value);
      },
      railStyle,
    },
    // slots: {
    //   checked: () => "自然赠予你，树冠 微风 肩头的暴雨",
    //   unchecked: () => "片刻后生成，平衡 忠诚 不息的身体",
    // },
  },
  {
    field: "checkboxGroupValue",
    formItemGiProps: {
      label: "Checkbox Group",
      span: 12,
    },
    type: "checkbox-group",
    props: {
      "onUpdate:value": (value: boolean) => {
        console.log("Checkbox Group", value);
      },
    },
    hide: (row) => row.switchValue,
    childrenOptions: [
      {
        tag: "checkbox",
        props: {
          label: "Option 1",
          value: "Option 1",
        },
      },
      {
        tag: "checkbox",
        props: {
          label: "Option 2",
          value: "Option 2",
        },
      },
      {
        tag: "checkbox",
        props: {
          label: "Option 3",
          value: "Option 3",
        },
      },
    ],
    slots: {
      default: () => {
        return (
          <NSpace>
            <NCheckbox value="Option 4">Option 4</NCheckbox>
            <NCheckbox value="Option 5">Option 5</NCheckbox>
            <NCheckbox value="Option 6">Option 6</NCheckbox>
          </NSpace>
        );
      },
    },
  },
  {
    field: "radioGroupValue",
    type: "radio-group",
    formItemGiProps: {
      label: "Radio Group",
      span: 12,
    },
    hide: model.value.switchValue,
    childrenOptions: [
      {
        tag: "radio",
        props: {
          label: "Option 1",
          value: "Option 1",
        },
      },
      {
        tag: "radio",
        props: {
          label: "Option 2",
          value: "Option 2",
        },
      },
      {
        tag: "radio-button",
        props: {
          label: "Option 3",
          value: "Option 3",
        },
      },
    ],
  },
  {
    field: "radioGroupValue",
    type: "radio-group",
    formItemGiProps: {
      label: "Radio Button Group",
      span: 12,
    },
    childrenOptions: [
      {
        tag: "radio",
        props: {
          label: "Option 1",
          value: "Option 1",
        },
      },
      {
        tag: "radio",
        props: {
          label: "Option 2",
          value: "Option 2",
        },
      },
      {
        tag: "radio",
        props: {
          label: "Option 3",
          value: "Option 3",
        },
      },
      {
        tag: "radio-button",
        props: {
          label: "Option 4",
          value: "Option 4",
        },
      },
    ],
  },
  {
    field: "inputNumberValue",
    type: "input-number",
    formItemGiProps: {
      label: "Input Number",
      span: 12,
    },
  },
  {
    field: "timePickerValue",
    type: "time-picker",
    formItemGiProps: {
      span: 12,
      label: "Time Picker",
    },
  },
  {
    field: "sliderValue",
    type: "slider",
    formItemGiProps: {
      span: 12,
      label: "Slider",
    },
  },
  {
    field: "transferValue",
    type: "transfer",
    formItemGiProps: {
      span: 14,
      label: "Transfer",
    },
    props: {
      options: generalOptions,
    },
  },
  {
    field: "nestedValue.path1",
    type: "cascader",
    formItemGiProps: {
      span: 10,
      label: "Nested Path",
    },
    props: {
      placeholder: "Nested Path 1",
      options: nestedOptions,
    },
  },
  {
    field: "nestedValue.path2",
    type: "select",
    formItemGiProps: {
      span: 24,
      label: "Nested Path 2",
    },
    props: {
      options: generalOptions,
      placeholder: "Nested Path 2",
    },
  },
]);

function handleAddButtonClick() {
  model.value.hobbies.push({ id: crypto.randomUUID(), hobby: "" });
}

const { NFormPro, formRef } = useForm({
  items,
  rules,
  value: model,
  grid: {
    xGap: 12,
    yGap: 12,
  },
  size: "large",
  validateMessages: { required: "我们非常需要 %s" },
});

async function handleValidateButtonClick() {
  const res = await formRef.value?.validate();
  console.log(res);
}
</script>

<style scoped>
.container {
  margin: 50px auto;
  display: flex;
  gap: 20px;
}
</style>
