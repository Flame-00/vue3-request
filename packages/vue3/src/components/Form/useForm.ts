import { NFormPro} from "./";
import {
  h,
  type ComponentInstance,
  reactive,
  ref,
  type Ref,
  type FunctionalComponent,
} from "vue";
import { type FormInst } from "naive-ui";

type UseFormProps = ComponentInstance<typeof NFormPro> & {
  ref: Ref<FormInst | null>;
};

export function useForm(props: Partial<UseFormProps>) {
  const formRef = ref<FormInst | null>(null);

  const Component: FunctionalComponent = (_, { slots }) => {
    return h(
      NFormPro,
      { ...reactive(props), ref: formRef } as UseFormProps,
      slots
    );
  };

  return {
    NFormPro: Component,
    formRef,
  };
}
