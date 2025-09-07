import type {
  CheckboxProps,
  FormItemGiProps,
  FormItemInst,
  RadioProps,
  GridProps,
} from "naive-ui";
import type { Ref, VNode, Reactive } from "vue";
import { components } from "./components";

type Type = keyof typeof components;

export type FormItemScope<V = any> = {
  item: BaseItem<V>;
  index: number;
  value: V;
};

export type Props = {
  items: Item[] | Ref<Item[]> | Reactive<Item[]>;
  grid?: GridProps;
};

type Render<V = any> = (scope: FormItemScope<V>) => VNode;

type BaseProps<V = any> = {
  render?: Render<V>;
  props?: Record<string, any>;
  vModelKey?: string;
  hidden?: boolean;
  defaultFormItem?: boolean;
  slots?: Record<string, any>;
  ref?:
    | Ref<FormItemInst | null>
    | ((el: FormItemInst) => void)
    | FormItemInst
    | null;
  path: string;
} & FormItemGiProps;

type ChildrenOptions<T, P> = {
  tag: T;
  props: P;
  slots?: Record<string, any>;
};

type CheckboxGroupItem = {
  type: "checkbox-group";
  childrenOptions?: ChildrenOptions<"checkbox", CheckboxProps>[];
};

type RadioGroupItem = {
  type: "radio-group";
  childrenOptions?: ChildrenOptions<"radio" | "radio-button", RadioProps>[];
};

type OtherComponentItem = {
  type?: Type;
  childrenOptions?: never;
};

export type BaseItem<V = any> = BaseProps<V> &
  (CheckboxGroupItem | RadioGroupItem | OtherComponentItem);

export type Item = BaseItem;
