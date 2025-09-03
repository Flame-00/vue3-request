import {
  NInput,
  NCheckbox,
  NRadio,
  NRadioGroup,
  NRadioButton,
  NSelect,
  NSwitch,
  NCalendar,
  NCheckboxGroup,
  NInputNumber,
  NSlider,
  NTimePicker,
  NTransfer,
  NCascader,
  NDatePicker,
} from "naive-ui";

export const components = {
  input: {
    component: NInput,
    vModelKey: "value",
  },
  checkbox: {
    component: NCheckbox,
    vModelKey: "checked",
  },
  radio: {
    component: NRadio,
    vModelKey: "checked",
  },
  "radio-group": {
    component: NRadioGroup,
    vModelKey: "value",
  },
  "radio-button": {
    component: NRadioButton,
    vModelKey: "value",
  },
  select: {
    component: NSelect,
    vModelKey: "value",
  },
  switch: {
    component: NSwitch,
    vModelKey: "value",
  },
  calendar: {
    component: NCalendar,
    vModelKey: "value",
  },
  "checkbox-group": {
    component: NCheckboxGroup,
    vModelKey: "value",
  },
  "input-number": {
    component: NInputNumber,
    vModelKey: "value",
  },
  slider: {
    component: NSlider,
    vModelKey: "value",
  },
  "time-picker": {
    component: NTimePicker,
    vModelKey: "value",
  },
  transfer: {
    component: NTransfer,
    vModelKey: "value",
  },
  cascader: {
    component: NCascader,
    vModelKey: "value",
  },
  "date-picker": {
    component: NDatePicker,
    vModelKey: "value",
  },
};
