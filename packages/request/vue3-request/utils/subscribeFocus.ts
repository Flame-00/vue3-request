import { isDocumentVisible } from "./isDocumentVisible";
import { isOnline } from "./isOnline";
import { isServer } from "./";

type Listener = () => void;

const listeners: Set<Listener> = new Set();

const subscribeFocus = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const revalidate = () => {
  if (!isDocumentVisible() || !isOnline()) return;
  listeners.forEach((listener) => {
    listener();
  });
};

if (!isServer && window?.addEventListener) {
  window.addEventListener("visibilitychange", revalidate, false);
  window.addEventListener("focus", revalidate, false);
}

export { subscribeFocus };
