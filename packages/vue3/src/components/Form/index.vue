<template>
  <n-form v-bind="mergeFormProps" :model :ref="(exposed) => vm!.exposed = exposed">
    <n-grid v-bind="mergeGridProps">
      <n-grid-item v-bind="mergeFormItemGiProps(item)" v-for="(item, index) in formItems" :key="item.path">
        <n-form-item v-if="item.defaultFormItem" v-bind="mergeFormItemGiProps(item)" :ref="(instance) => {
          if (instance) {
            formItemRef[item.path] = instance as unknown as FormItemInst;
          }
        }
          ">
          <slot :name="item.path" v-bind="{ item, index, value: model[item.path] }">
            <component :is="generateComponent({ item, index, value: model[item.path] })"></component>
          </slot>
        </n-form-item>
        <slot :name="item.path" v-bind="{ item, index, value: model[item.path] }" v-else>
          <component :is="generateComponent({ item, index, value: model[item.path] })"></component>
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
  reactive,
  watch,
} from "vue";
import type { BaseItem, FormItemScope, Item, Props } from "./types";
import { components } from "./components";
import {
  NFormItem,
  NGridItem,
  NGrid,
  type FormItemGiProps,
  type FormItemInst,
} from "naive-ui";
import { h, mergeProps } from "vue";
import { omit } from "./util";

const vm = getCurrentInstance();

const props = defineProps<Props>();

const model = defineModel<Record<string, any>>('value', { required: true });

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
  return mergeProps(defaultFormItemGiProps, omit(item, ["ref"]) ?? {});
};

function _setDefaultProps(item: BaseItem, defaultProps: [string, any][]) {
  return defaultProps.reduce((acc, [key, value]) => {
    acc[key] = acc[key] ?? value;
    return acc;
  }, item as Record<string, any>);
}

const formItemRef: Record<string, FormItemInst> = reactive({});
console.log("formItemRef", formItemRef);
const formItems = computed(() => {
  return (reactive(props.items) as Item[]).map((item) => {
    const setDefaultProps = _setDefaultProps(item, [
      ["defaultFormItem", true],
      ["vModelKey", components[item.type!]?.vModelKey ?? "value"],
    ]);
    if ("ref" in item && Reflect.has(item, "ref")) {
      typeof item.ref === "function"
        ? item.ref(formItemRef[item.path])
        : (item.ref = formItemRef[item.path]);
    }
    return { ...item, ...setDefaultProps };
  });
});

watch(formItems, () => {
  console.log("formItems", formItems.value);
});

function _getComponent(tag?: keyof typeof components): Component {
  return components[tag ?? "input"].component;
}

const generateComponent = (scope: FormItemScope) => {
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
        model.value[path] = newValue;
        itemProps?.[`onUpdate:${vModelKey}`]?.(newValue);
      }
    },
    [vModelKey!]: model.value?.[path],
  };

  if (render) {
    const rd = render(scope);
    if (!isVNode(rd)) {
      return h("div", rd);
    }
    return h(rd, componentProps, slots);
  }

  return h(_getComponent(type), componentProps, {
    default: () =>
      childrenOptions?.map(({ tag, props, slots }) =>
        h(_getComponent(tag), props, slots)
      ),
    ...slots,
  });
};

defineExpose({} as ComponentInstance<typeof NForm>);
</script>

<style scoped></style>
