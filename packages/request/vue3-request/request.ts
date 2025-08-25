import type {
  ServiceType,
  BaseOptions,
  IState,
  PluginMethodsReturn,
  PluginReturn,
} from "./types";
import { reactive } from "vue";
import { composeMiddleware, isFunction, neverPromise } from "./utils";
export class Request<D, P extends any[]> {
  currentRequestId: number = 0;

  pluginImpls: PluginReturn<D, P>[] = [];

  state: IState<D, P>;

  abort: () => void = () => {};

  constructor(
    public service: ServiceType<D, P>,
    public options: BaseOptions<D, P>
  ) {
    this.state = reactive({
      data: undefined,
      error: undefined,
      params: options?.defaultParams || [],
      loading: false,
      isFinished: false,
      isAborted: false,
      signal: new AbortController().signal,
    }) as IState<D, P>;
  }
  setState = (s: Partial<IState<D, P>>) => {
    Object.assign(this.state, s);
  };
  executePlugin = (
    event: keyof PluginReturn<D, P>,
    ...rest: any[]
  ): PluginMethodsReturn<D, P> => {
    if (event === "onRequest") {
      const servicePromise = composeMiddleware<D>(
        this.pluginImpls.map((plugin) => plugin.onRequest).filter(Boolean) as ((
          service: ServiceType<D>
        ) => ServiceType<D>)[],
        rest[0]
      );
      return {
        servicePromise,
      };
    } else {
      // 执行插件里的方法
      const r = this.pluginImpls // @ts-ignore
        .map((plugin) => plugin[event]?.(...rest))
        .filter(Boolean);
      return Object.assign({}, ...r);
    }
  };
  // 设置加载状态
  loading = (loading: boolean) => {
    this.setState({ loading, isFinished: !loading });
  };
  // 请求完成
  onFinished = () => {
    this.executePlugin(
      "onFinally",
      this.state.params,
      this.state.data,
      this.state.error
    ); // 执行插件的onFinally方法
    this.loading(false);
    this.options.onFinally?.(
      this.state.params,
      this.state.data,
      this.state.error
    );
  };
  runAsync = async (...params: P): Promise<D> => {
    const requestId = ++this.currentRequestId;

    // 执行插件的onBefore方法
    const { isReturn, isReady, ...rest } = this.executePlugin(
      "onBefore",
      params
    );

    if (!isReady) {
      return neverPromise();
    }
    this.setState({ params });
    this.loading(true);

    if (isReturn) {
      this.loading(rest.loading || false);
      return rest.data as D;
    }
    this.options.onBefore?.(params);

    try {
      const serviceWrapper = () => this.service(...params);

      let { servicePromise } = this.executePlugin("onRequest", serviceWrapper);

      // 如果onRequest没有返回servicePromise，则使用原始service
      if (!servicePromise) {
        servicePromise = serviceWrapper();
      }
      const res = await servicePromise;
      // console.log(
      //   "success 竞态取消 ->",
      //   requestId !== this.currentRequestId
      //     ? `已取消 -> requestId: ${requestId} !== currentRequestId: ${this.currentRequestId}`
      //     : `成功请求 -> requestId: ${requestId} === currentRequestId: ${this.currentRequestId}`
      // );
      if (requestId !== this.currentRequestId) {
        return neverPromise();
      }

      this.setState({ data: res, error: undefined });
      this.executePlugin("onSuccess", res, params); // 执行插件的onSuccess方法
      this.options.onSuccess?.(res, params);
      this.onFinished();

      return res;
    } catch (err) {
      // console.log(
      //   "error 竞态取消 ->",
      //   requestId !== this.currentRequestId
      //     ? `已取消 -> requestId: ${requestId} !== currentRequestId: ${this.currentRequestId}`
      //     : `成功请求 -> requestId: ${requestId} === currentRequestId: ${this.currentRequestId}`
      // );

      if (requestId !== this.currentRequestId) {
        return neverPromise();
      }
      const error = err as Error;
      this.setState({ data: undefined, error });
      this.executePlugin("onError", error, params); // 执行插件的onError方法
      this.options.onError?.(error, params);
      this.onFinished();

      throw error;
    }
  };

  run = (...params: P) => { 
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  };

  refresh = () => {
    this.run(...this.state.params);
  };

  refreshAsync = async () => {
    return await this.runAsync(...this.state.params);
  };

  mutate = (data: D | ((data: D) => D)) => {
    if (isFunction(data)) {
      data(this.state.data as D);
    } else {
      this.setState({ data });
    }
    this.executePlugin("onMutate", this.state.data);
  };

  cancel = () => {
    this.executePlugin("onCancel");
    this.currentRequestId++;
    this.loading(false);
  };
}
