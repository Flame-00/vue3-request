import { NFormPro, type Props } from "./";
import {
  h,
  type ComponentInstance,
  reactive,
  ref,
  type FunctionalComponent,
} from "vue";
import { type FormInst, type FormProps } from "naive-ui";

export function useForm(
  props: Props &
    FormProps & { value: ComponentInstance<typeof NFormPro>["value"] }
) {
  const formRef = ref<FormInst | null>(null);

  const Component: FunctionalComponent = (_, { slots }) => {
    return h(NFormPro, { ...reactive(props), ref: formRef }, slots);
  };

  return {
    NFormPro: Component,
    formRef,
  };
}
