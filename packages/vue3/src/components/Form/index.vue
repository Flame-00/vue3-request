<template>
    <n-form v-bind="$attrs" :ref="(exposed) => vm!.exposed = exposed">
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
import { NForm, NFormItemGi, NGrid, NInput } from 'naive-ui'
import { h, type ComponentInstance, getCurrentInstance } from 'vue'
import type { ItemType, Type } from './types'
import { components } from './components'

const vm = getCurrentInstance()

const props = defineProps<{
    items: ItemType[],
    model: Record<string, any>,
}>()

const getComponent = (type?: Type) => {
    if (type && typeof type === 'string') {
        return components[type]
    }
    return type ?? NInput
}

defineExpose({} as ComponentInstance<typeof NForm> & ComponentInstance<typeof NGrid>)
</script>

<style scoped></style>