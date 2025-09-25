<template>
  <n-form
    v-bind="mergeFormProps"
    :model
    :ref="(exposed) => vm!.exposed = exposed"
  >
    <n-grid v-bind="mergeGridProps">
      <template v-for="(item, index) in formItems" :key="item.field">
        <n-grid-item v-bind="mergeFormItemGiProps(item)" v-if="!isHidden(item)">
          <n-form-item
            v-if="item.defaultFormItem"
            :path="item.field"
            v-bind="mergeFormItemGiProps(item)"
            :ref="(instance) => {
            if (instance) {
              formItemRef[item.field] = instance as unknown as FormItemInst;
            }
          }
            "
          >
            <slot
              :name="item.field"
              v-bind="{ item, index, value: model[item.field] }"
            >
              <component
                :is="
                  generateComponent({ item, index, value: model[item.field] })
                "
              ></component>
            </slot>
          </n-form-item>
          <slot
            :name="item.field"
            v-bind="{ item, index, value: model[item.field] }"
            v-else
          >
            <component
              :is="generateComponent({ item, index, value: model[item.field] })"
            ></component>
          </slot>
        </n-grid-item>
      </template>
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
  toRaw,
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

const model = defineModel<Record<string, any>>("value", { required: true });

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
  return mergeProps(
    defaultFormItemGiProps,
    omit(item.formItemGiProps ?? {}, ["ref"]) ?? {}
  );
};

function _setDefaultProps(item: BaseItem, defaultProps: [string, any][]) {
  return defaultProps.reduce((acc, [key, value]) => {
    acc[key] = acc[key] ?? value;
    return acc;
  }, item as Record<string, any>);
}

const formItemRef: Record<string, FormItemInst> = reactive({});
const formItems = computed(() => {
  return (props.items as Item[]).map((item) => {
    const setDefaultProps = _setDefaultProps(toRaw(item), [
      ["defaultFormItem", true],
      ["vModelKey", components[item.type!]?.vModelKey ?? "value"],
      ["hide", false],
    ]);
    if (item.formItemGiProps && Reflect.has(item.formItemGiProps, "ref")) {
      typeof item.formItemGiProps.ref === "function"
        ? item.formItemGiProps.ref(formItemRef[item.field])
        : (item.formItemGiProps.ref = formItemRef[item.field]);
    }
    return { ...item, ...setDefaultProps };
  });
});

function isHidden(item: Item) {
  if (typeof item.hide === "function") {
    return item.hide(model.value);
  }
  return item.hide;
}

const _getComponent = (tag?: keyof typeof components): Component =>
  components[tag ?? "input"].component;

const generateComponent = (scope: FormItemScope) => {
  const {
    item: {
      type,
      vModelKey,
      field,
      render,
      props: itemProps,
      slots,
      childrenOptions,
    },
  } = scope;

  const componentProps = {
    ...itemProps,
    [`onUpdate:${vModelKey}`]: (newValue: any) => {
      if (field) {
        model.value[field] = newValue;
        itemProps?.[`onUpdate:${vModelKey}`]?.(newValue);
      }
    },
    [vModelKey!]: model.value?.[field],
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
