import { useAbortPlugin } from "./useAbortPlugin";
import { useCachePlugin } from "./useCachePlugin";
import { useErrorRetryPlugin } from "./useErrorRetryPlugin";
import { usePollingPlugin } from "./usePollingPlugin";
import { useRefreshDepsPlugin } from "./useRefreshDepsPlugin";
import { useRefreshOnWindowFocusPlugin } from "./useRefreshOnWindowFocusPlugin";
import { useReadyPlugin } from "./useReadyPlugin";
export default [
  useErrorRetryPlugin,
  usePollingPlugin,
  useRefreshDepsPlugin,
  useRefreshOnWindowFocusPlugin,
  useAbortPlugin,
  useReadyPlugin,
  useCachePlugin,
];
