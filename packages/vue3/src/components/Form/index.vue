<template>
    <n-form v-bind="$attrs" ref="formInstRef">
        <n-grid v-bind="$attrs">
            <n-form-item-gi v-bind="item" v-for="item in props.items" :key="item.path">
                <slot :name="item.path">
                    <component :is="h(getComponent(item.type), {
                        ...item.props,
                        [`onUpdate:${item.modelKey ?? 'value'}`]: (value: any) => {
                            if (item.path) {
                                props.model[item.path] = value
                            }
                        },
                        [item.modelKey ?? 'value']: props.model?.[item.path ?? '']
                    })" />
                </slot>
            </n-form-item-gi>
        </n-grid>
        <slot name="actions"></slot>
    </n-form>
</template>

<script setup lang="ts">
import { NForm, NFormItemGi, NGrid, NInput, NInputNumber, NSlider, NTimePicker, NTransfer, NCarouselItem, NCascader, NDatePicker, NButton, NCheckbox, NCheckboxGroup, NButtonGroup, NCalendar, NRadio, NRadioGroup, NRadioButton, NSelect, NSwitch, type FormInst, type FormRules } from 'naive-ui'
import { ref, useTemplateRef, h, type VNode, type Component, type ComponentInstance } from 'vue'
import type { ItemType, Type } from './types'

const formInstRef = useTemplateRef<FormInst>('formInstRef')

const props = defineProps<{
    items: ItemType[],
    model: Record<string, any>,

}>()

const components: Record<string, Component> = {
    'input': NInput,
    'checkbox': NCheckbox,
    'button': NButton,
    'radio': NRadio,
    'radio-group': NRadioGroup,
    'radio-button': NRadioButton,
    'select': NSelect,
    'switch': NSwitch,
    'calendar': NCalendar,
    'button-group': NButtonGroup,
    'checkbox-group': NCheckboxGroup,
    'input-number': NInputNumber,
    'slider': NSlider,
    'time-picker': NTimePicker,
    'transfer': NTransfer,
    'carousel-item': NCarouselItem,
    'cascader': NCascader,
    'date-picker': NDatePicker,
}

const getComponent = (type?: Type) => {
    if (type && typeof type === 'string') {
        return components[type]
    }
    return type ?? NInput
}

defineExpose({} as ComponentInstance<typeof NForm> & ComponentInstance<typeof NGrid>)
</script>

<style scoped></style>