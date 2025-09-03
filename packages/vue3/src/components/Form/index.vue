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
          :value="model[item.path!]"
        >
          <component
            v-bind="item.props"
            v-if="item.render && !item.defaultFormItem"
            :is="getComponent({ item, index, value: model[item.path!] })"
          ></component>
          <n-form-item v-bind="mergeFormItemGiProps(item)" v-else>
            <component
              :is="getComponent({ item, index, value: model[item.path!] })"
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
import {
  type ComponentInstance,
  getCurrentInstance,
  useAttrs,
  type Component,
  computed,
  isVNode,
} from "vue";
import type { BaseItem, FormItemScope } from "./types";
import { components } from "./components";
import { NFormItem, NGridItem, NGrid, type FormItemGiProps } from "naive-ui";
import { h, mergeProps } from "vue";

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
console.log(mergeFormProps);

const defaultFormItemGiProps: FormItemGiProps = {
  span: 24,
};
const mergeFormItemGiProps = (item: BaseItem) => {
  return mergeProps(defaultFormItemGiProps, item ?? {});
};

function _setDefaultProps(item: BaseItem, defaultProps: [string, any][]) {
  return defaultProps.reduce((acc, [key, value]) => {
    acc[key] = acc[key] ?? value;
    return acc;
  }, item as Record<string, any>);
}

const formItems = computed(() => {
  return props.items.map((item) => {
    const defaultProps = _setDefaultProps(item, [
      ["isFormItem", true],
      ["vModelKey", components[item.type!]?.vModelKey ?? "value"],
    ]);
    return { ...item, ...defaultProps };
  });
});

console.log("formItems", formItems.value);

const getComponent = (scope: FormItemScope) => {
  const {
    item: {
      type,
      vModelKey,
      path,
      render,
      props: itemProps,
      slots,
      childrenOptions,
    },
  } = scope;

  const componentProps = {
    ...itemProps,
    [`onUpdate:${vModelKey}`]: (newValue: any) => {
      if (path) {
        props.model[path] = newValue;
        itemProps?.[`onUpdate:${vModelKey}`]?.(newValue);
      }
    },
    [vModelKey!]: props.model?.[path!],
  };

  if (render) {
    const r = render(scope);
    if (r && !isVNode(r)) {
      return h("div", r);
    }
    return r;
  }

  function _getComponent(tag?: keyof typeof components) {
    return components[tag ?? "input"].component as Component;
  }

  const component = _getComponent(type);

  if (type && slots) {
    return h(component, componentProps, slots);
  }

  if (type && childrenOptions) {
    return h(component, componentProps, {
      default: () =>
        childrenOptions.map((ot) =>
          h(_getComponent(ot.tag), ot.props, ot.slots)
        ),
    });
  }
  return h(component, componentProps);
};

defineExpose({} as ComponentInstance<typeof NForm>);
</script>

<style scoped></style>
