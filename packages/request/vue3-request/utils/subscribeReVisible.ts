import { isDocumentVisible } from "./isDocumentVisible";

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

window.addEventListener("visibilitychange", revalidate, false);

export { subscribe };
