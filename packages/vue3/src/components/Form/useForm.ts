import { NFormPro } from "./";
import { defineComponent, useTemplateRef, h } from "vue";
import type { FormProps, FormInst } from "naive-ui";
import type { Props } from "./types";

export function useForm(options: Props & FormProps) {
  return {
    NFormPro: defineComponent({
      setup(_, { slots }) {
        const ref = useTemplateRef<FormInst>("formRef");
        const componentProps = { ...options, ref };
        return () => h(NFormPro, componentProps, slots);
      },
    }),
  };
}
  