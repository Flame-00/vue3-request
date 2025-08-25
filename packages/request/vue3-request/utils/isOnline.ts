import { isServer } from "./";

export const isOnline = () => (!isServer && window.navigator?.onLine) ?? true;
