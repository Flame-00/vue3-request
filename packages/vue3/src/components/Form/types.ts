import type { CheckboxProps, FormItemGiProps, RadioProps } from "naive-ui";
import type { VNodeChild } from "vue";
import { components } from "./components";

type Type = keyof typeof components;

export type FormItemScope<V = any> = {
  item: BaseItem<V>;
  index: number;
  value: V;
};

type Render<V = any> = (scope: FormItemScope<V>) => VNodeChild;

type BaseProps<V = any> = {
  render?: Render<V>;
  props?: Record<string, any>;
  vModelKey?: string;
  hidden?: boolean;
  defaultFormItem?: boolean;
  slots?: Record<string, any>;
} & FormItemGiProps;

type CheckboxGroupItem = {
  type: "checkbox-group";
  childrenOptions?: {
    tag: "checkbox";
    props: CheckboxProps;
    slots?: Record<string, any>;
  }[];
};

type RadioGroupItem = {
  type: "radio-group";
  childrenOptions?: {
    tag: "radio" | "radio-button";
    props: RadioProps;
    slots?: Record<string, any>;
  }[];
};

type OtherComponentItem = {
  type?: Type;
  childrenOptions?: never;
};

export type BaseItem<V = any> = (
  | CheckboxGroupItem
  | RadioGroupItem
  | OtherComponentItem
) &
  BaseProps<V>;

export type Item = BaseItem;
