import { useAbortPlugin } from "./useAbortPlugin";
import { useCachePlugin } from "./useCachePlugin";
import { useErrorRetryPlugin } from "./useErrorRetryPlugin";
import { usePollingPlugin } from "./usePollingPlugin";
import { useRefreshDepsPlugin } from "./useRefreshDepsPlugin";
import { useRefreshOnWindowFocusPlugin } from "./useRefreshOnWindowFocusPlugin";
export default [
  useErrorRetryPlugin,
  usePollingPlugin,
  useRefreshDepsPlugin,
  useRefreshOnWindowFocusPlugin,
  useAbortPlugin,
  useCachePlugin,
];
