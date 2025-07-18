import { Plugin } from "../types";
import { debounce } from "xe-utils";
import { isNil } from "../utils";

export const useDebouncePlugin: Plugin = (
  requestInstance,
  { debounceWait }
) => {
  if (isNil(debounceWait)) return;
  return {};
};
