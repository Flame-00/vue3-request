<template>
    <div class="container">
        <Form style="flex: 1" :items :model :x-gap="20" :y-gap="20">
            <template #actions>
                <div style="display: flex; justify-content: flex-end;">
                    <n-button type="primary" @click="handleValidateButtonClick">
                        验证
                    </n-button>
                </div>
            </template>
        </Form>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
    </div>
</template>

<script setup lang="tsx">
import {  ref } from 'vue'
import Form from './components/Form/index.vue'
import type { ItemType } from './components/Form/types'
import { NCheckboxGroup, NCheckbox, NSpace, NInput, NRadioGroup, NRadio, NRadioButton ,NGi,NButton} from 'naive-ui'

const model = ref({
    inputValue: null,
    textareaValue: null,
    selectValue: null,
    multipleSelectValue: null,
    datetimeValue: null,
    nestedValue: {
        path1: null,
        path2: null
    },
    switchValue: false,
    checkboxGroupValue: null,
    radioGroupValue: null,
    inputNumberValue: null,
    timePickerValue: null,
    sliderValue: 0,
    transferValue: null
})

const generalOptions = ['groode', 'veli good', 'emazing', 'lidiculous'].map(
    v => ({
        label: v,
        value: v
    })
)
const nestedOptions = [
{
          label: 'groode',
          value: 'groode',
          children: [
            {
              label: 'veli good',
              value: 'veli good'
            }
          ]
        }
]

const items : ItemType[] = [
    {
        label: 'Input',
        path: 'inputValue',
        type:  NInput,
        span: 12,
        props: {
            placeholder: 'Input'
        }
    },
    {
        label: 'Textarea',
        path: 'textareaValue',
        type: 'input',
        span: 12,
        props: {
            type: 'textarea',
            placeholder: 'Textarea',
            autosize: {
                minRows: 3,
                maxRows: 5,
            }
        }
    },
    {
        label: 'Select',
        path: 'selectValue',
        type: 'select',
        span: 12,
        props: {
            options: generalOptions,
            placeholder: 'Select'
        }
    },
    {
        label: 'Multiple Select',
        path: 'multipleSelectValue',
        span: 12,
        type: 'select',
        props: {
            placeholder: 'Select',
            options: generalOptions,
            multiple: true
        }
    },
    {
        label: 'Datetime',
        path: 'datetimeValue',
        type: 'date-picker',
        span: 12,
        props: {
            type: 'datetime',
        }
    },
    {
        label: 'Switch',
        path: 'switchValue',
        type: 'switch',
        span: 12,
    },
    {
        label: 'Checkbox Group',
        path: 'checkboxGroupValue',
        type: () =>
        <NCheckboxGroup v-model:value={model.value.checkboxGroupValue}>
          <NSpace>          
            <NCheckbox value="Option 1">
              Option 1
            </NCheckbox>
                <NCheckbox value="Option 2">
              Option 2
            </NCheckbox>
            <NCheckbox value="Option 3">
              Option 3
            </NCheckbox>
          </NSpace>
        </NCheckboxGroup>
        ,
        span: 12,
    },
    {
        label: 'Radio Group',
        path: 'radioGroupValue',
        type: () =>
        <NRadioGroup v-model:value={model.value.radioGroupValue}>
          <NSpace>          
            <NRadio value="Option 1">
              Option 1
            </NRadio>
            <NRadio value="Option 2">     
              Option 2
            </NRadio>
            <NRadio value="Option 3">
              Option 3
            </NRadio>
          </NSpace>
        </NRadioGroup>,
        span: 12,
    },
    {
        label: 'Radio Button Group',
        path: 'radioGroupValue',
        type: () =>
        <NRadioGroup v-model:value={model.value.radioGroupValue}> 
            <NRadioButton value="Option 1">
              Option 1
            </NRadioButton>
            <NRadioButton value="Option 2">
              Option 2
            </NRadioButton>
            <NRadioButton value="Option 3">
              Option 3
            </NRadioButton>
        </NRadioGroup>,
        span: 12,
    },
    {
        label: 'Input Number',
        path: 'inputNumberValue',
        type: 'input-number',
        span: 12,
    },
    {
        label: 'Time Picker',
        path: 'timePickerValue',
        type: 'time-picker',
        span: 12,
    },
    {
        label: 'Slider',
        path: 'sliderValue',
        type: 'slider',
        span: 12,
    },
    {
        label: 'Transfer',
        path: 'transferValue',
        type: 'transfer',
        span: 14,
        props: {
            options: generalOptions,
        }
    },
    {
        label: 'Nested Path',
        path: 'nestedValue.path1',
        type: 'cascader',
        span: 5,
        props: {
            placeholder: 'Nested Path 1',
            options: nestedOptions,
        }
    },
    {
        label: 'Nested Path 2',
        path: 'nestedValue.path2',
        type: 'select',
        span: 5,
        props: {
            options: generalOptions,
            placeholder: 'Nested Path 2'
        }
    },
]

function handleValidateButtonClick() {
    console.log(model.value)
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