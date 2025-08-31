import type { FormItemGiProps } from "naive-ui";
import type { VNode } from "vue";

export type BaseItem<V = any> = {
  type?: Type;
  render?: Render<V>;
  props?: Record<string, any>;
  vModelKey?: string;
  hidden?: boolean;
  isFormItem?: boolean;
} & FormItemGiProps;

export type Item = BaseItem;

export type FormItemScope<V = any> = {
  item: Item;
  index: number;
  value: V;
};

export type Render<V = any> = (scope: FormItemScope<V>) => VNode;

export type Type = string | (() => VNode);
