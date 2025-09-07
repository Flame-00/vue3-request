<template>
  <div class="container">
    <n-button type="primary" @click="handleClick"> 点击</n-button>
    <NFormPro>
      <template #hobbies="{ value }">
        <n-form-item v-for="(item, index) in value" :key="item.id" :label="`爱好${index + 1}`"
          :path="`hobbies[${index}].hobby`" :rule="{
            required: true,
            message: `请输入爱好${index + 1}`,
            trigger: ['input', 'blur'],
          }">
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

const testvalue = ref(null);

// const formRef = useTemplateRef<FormInst>("formRef");
const selectInstRef = ref<SelectInst | null>(null);
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
}

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

const items = reactive<Item[]>([
  // hobbies,
  {
    path: "hobbies",
    defaultFormItem: false,
    span: 24,
  },
  {
    label: "Checkbox",
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

    path: "checkboxValue",
    type: "checkbox",
    span: 12,
    slots: {
      default: () => "自然赠予你，树冠 微风 肩头的暴雨",
    },
  },
  {
    label: "Input",
    path: "inputValue",
    ref: formItemRefInput,
    span: 12,
    render(scope) {
      return <NInput />;
    },
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
    ref: (instance) => {
      formItemRefSelect.value = instance;
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
    label: "Checkbox Group",
    path: "checkboxGroupValue",
    span: 12,
    type: "checkbox-group",
    props: {
      "onUpdate:value": (value: boolean) => {
        console.log("Checkbox Group", value);
      },
    },
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
    label: "Radio Group",
    path: "radioGroupValue",
    type: "radio-group",
    span: 12,
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
    label: "Radio Button Group",
    path: "radioGroupValue",
    type: "radio-group",
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
    span: 10,
    props: {
      placeholder: "Nested Path 1",
      options: nestedOptions,
    },
  },
  {
    label: "Nested Path 2",
    path: "nestedValue.path2",
    type: "select",
    span: 24,
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
  grid: {
    xGap: 12,
    yGap: 12,
  },
  rules,
  value: model,
  labelPlacement: "left",
  showLabel: false, 
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
