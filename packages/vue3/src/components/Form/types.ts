import type { FormItemGiProps, FormProps } from "naive-ui";
import type { VNode, Component } from "vue";
export type ItemType = {
  type?: Type;
  props?: Record<string, any>;
  modelKey?: string;
} & FormItemGiProps;
export type Type = string | VNode | Component;  