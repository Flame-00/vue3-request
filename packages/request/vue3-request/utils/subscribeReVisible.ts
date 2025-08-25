import { isDocumentVisible } from "./isDocumentVisible";
import { isServer } from "./";

type Listener = () => void;

const listeners: Set<Listener> = new Set();

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const revalidate = () => {
  if (!isDocumentVisible()) return;
  listeners.forEach((listener) => {
    listener();
  });
};

if (!isServer && window?.addEventListener) {
  window.addEventListener("visibilitychange", revalidate, false);
}

export { subscribe };
