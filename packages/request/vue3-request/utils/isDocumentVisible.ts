import { isServer, isNil } from "./";

export const isDocumentVisible = () => {
  if (isServer || isNil(window.document?.visibilityState)) return true;
  return document.visibilityState === "visible";
};  