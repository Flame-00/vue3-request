<template>
  <n-form
    v-bind="mergeFormProps"
    :model
    :ref="(exposed) => vm!.exposed = exposed"
  >
    <n-grid v-bind="mergeGridProps">
      <n-grid-item
        v-bind="mergeFormItemGiProps(item)"
        v-for="(item, index) in formItems"
        :key="item.path"
      >
        <slot
          :name="item.path"
          v-if="!item.hidden"
          :item
          :index
          :value="model[item.path ?? '']"
        >
          <component
            v-if="item.render && !item.isFormItem"
            :is="getComponent({ item, index, value: model[item.path ?? ''] })"
          ></component>
          <n-form-item v-bind="mergeFormItemGiProps(item)" v-else>
            <component
              :is="h(getComponent({ item, index, value: model[item.path ?? ''] }), {
              ...item.props,
              [`onUpdate:${item.vModelKey ?? 'value'}`]: (value: any) => {
                console.log(value);
                if (item.path) {
                  model[item.path] = value
                }
              },
              [item.vModelKey ?? 'value']: model?.[item.path ?? '']
            })"
            ></component>
          </n-form-item>
        </slot>
      </n-grid-item>
    </n-grid>
    <slot name="actions"></slot>
  </n-form>
</template>

<script setup lang="tsx">
import { NForm, type FormProps, type GridProps } from "naive-ui";
import { type ComponentInstance, getCurrentInstance, useAttrs } from "vue";
import type { BaseItem, FormItemScope } from "./types";
import { components } from "./components";
import {
  NInput,
  NFormItem,
  NGridItem,
  NGrid,
  type FormItemGiProps,
} from "naive-ui";
import { h, mergeProps, computed } from "vue";
const vm = getCurrentInstance();

const props = defineProps<{
  items: BaseItem[];
  grid?: GridProps;
  model: Record<string, any>;
}>();

const defaultGridProps: GridProps = {
  xGap: 24,
  yGap: 24,
};
const mergeGridProps = mergeProps(defaultGridProps, props.grid ?? {});

const defaultFormProps: FormProps = {};
const attrs = useAttrs();
const mergeFormProps = mergeProps(defaultFormProps, attrs ?? {});

const defaultFormItemGiProps: FormItemGiProps = {
  span: 24,
};
const mergeFormItemGiProps = (item: BaseItem) => {
  console.log();
  return mergeProps(defaultFormItemGiProps, item ?? {});
};

const formItems = props.items.map((item) =>
  item.isFormItem === undefined ? { ...item, isFormItem: true } : item
);

const getComponent = (scope: FormItemScope) => {
  const {
    item: { type, render },
  } = scope;
  if (render) {
    return render(scope);
  }
  if (type && typeof type === "string") {
    return components[type];
  }
  console.log(type);
  return type ?? NInput;
};

defineExpose({} as ComponentInstance<typeof NForm>);
</script>

<style scoped></style>
