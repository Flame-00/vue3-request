import { useAbortPlugin } from "./useAbortPlugin";
import { useCachePlugin } from "./useCachePlugin";
import { useErrorRetryPlugin } from "./useErrorRetryPlugin";
import { usePollingPlugin } from "./usePollingPlugin";
import { useRefreshDepsPlugin } from "./useRefreshDepsPlugin";
import { useRefreshOnWindowFocusPlugin } from "./useRefreshOnWindowFocusPlugin";
import { useReadyPlugin } from "./useReadyPlugin";
import { useDebouncePlugin } from "./useDebouncePlugin";
import { useThrottlePlugin } from "./useThrottlePlugin";
export default [
  useErrorRetryPlugin,
  usePollingPlugin,
  useRefreshDepsPlugin,
  useRefreshOnWindowFocusPlugin,
  useAbortPlugin,
  useReadyPlugin,
  useDebouncePlugin,
  useThrottlePlugin,
  useCachePlugin,
];
