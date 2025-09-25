import type {
  CheckboxProps,
  FormItemGiProps,
  FormItemInst,
  RadioProps,
  GridProps,
} from "naive-ui";
import type { Ref, VNode } from "vue";
import { components } from "./components";

export type Type = keyof typeof components;

export type FormItemScope<T = any, V = any> = {
  item: BaseItem<T, V>;
  index: number;
  value: V;
};

export type Props = {
  items: Item[] | Ref<Item[]>;
  grid?: GridProps;
};

type Render<T = any, V = any> = (scope: FormItemScope<T, V>) => VNode;

type BaseProps<T = any, V = any> = {
  render?: Render<T, V>;
  props?: Record<string, any>;
  vModelKey?: string;
  hide?: boolean | ((model: T) => boolean);
  defaultFormItem?: boolean;
  slots?: Record<string, any>;
  field: string;
  formItemGiProps?: Omit<FormItemGiProps, "labelProps"> & {
    ref?:
      | Ref<FormItemInst | null>
      | ((el: FormItemInst) => void)
      | FormItemInst
      | null;
  }; // Naive UI 使用了HTMLAttributes这种多层级嵌套类型对象， ts 递归最大值是 1000，会报错 类型实例化过深，可能无限;
};

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

export type BaseItem<T = any, V = any> = BaseProps<T, V> &
  (CheckboxGroupItem | RadioGroupItem | OtherComponentItem);

export type Item<T = any> = BaseItem<T>;
