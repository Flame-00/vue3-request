import type {
  CallbackType,
  IOptions,
  IState,
  PluginMethodsReturn,
  PluginReturn,
} from "./types";
import { reactive } from "vue";
import { composeMiddleware, neverPromise } from "./utils";
export class Request<D, P extends any[]> {
  currentRequestId: number = 0;

  pluginImpls: PluginReturn<D, P>[] = [];

  state: IState<D, P>;

  abort: () => void;

  constructor(
    public service: CallbackType<D>,
    public options?: IOptions<D, P>
  ) {
    this.state = reactive({
      data: undefined,
      isLoading: false,
      isFinished: false,
      isAborted: false,
      error: undefined,
      params: options?.defaultParams || [],
    }) as IState<D, P>;
  }
  setState = (s: Partial<IState<D, P>>) => {
    Object.assign(this.state, s);
  };
  executePlugin = (
    event: keyof PluginReturn<D, P>,
    ...rest: any[]
  ): PluginMethodsReturn<D> => {
    if (event === "onRequest") {
      const servicePromise = composeMiddleware<D>(
        this.pluginImpls.map((plugin) => plugin.onRequest).filter(Boolean),
        rest[0]
      );
      return {
        servicePromise,
      };
    } else {
      // 执行插件里的方法
      const r = this.pluginImpls
        .map((plugin) => plugin[event]?.apply(plugin, rest))
        .filter(Boolean);
      return Object.assign({}, ...r);
    }
  };
  // 设置加载状态
  loading = (isLoading: boolean) => {
    this.setState({ isLoading, isFinished: !isLoading });
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
    const { signal, isStaleTime, isReady } = this.executePlugin(
      "onBefore",
      this.state.params
    ); // 执行插件的onBefore方法
    if (!isReady) {
      return neverPromise();
    }

    params.length && this.setState({ params });
    this.loading(true);

    if (isStaleTime) {
      this.loading(false);
      return this.state.data;
    }
    this.options.onBefore?.(this.state.params);

    try {
      const serviceWrapper = () => this.service(signal)(...this.state.params);

      let { servicePromise } = this.executePlugin("onRequest", serviceWrapper);

      // 如果onRequest没有返回servicePromise，则使用原始service
      if (!servicePromise) {
        servicePromise = serviceWrapper();
      }
      const res = await servicePromise;

      console.log(
        "success 竞态取消 ->",
        requestId !== this.currentRequestId
          ? `已取消 -> requestId: ${requestId} !== currentRequestId: ${this.currentRequestId}`
          : `成功请求 -> requestId: ${requestId} === currentRequestId: ${this.currentRequestId}`
      );
      if (requestId !== this.currentRequestId) {
        return neverPromise();
      }

      this.setState({ data: res });
      this.executePlugin("onSuccess", res, this.state.params); // 执行插件的onSuccess方法
      this.options.onSuccess?.(res, this.state.params);
      this.onFinished();

      return res;
    } catch (err) {
      console.log(
        "error 竞态取消 ->",
        requestId !== this.currentRequestId
          ? `已取消 -> requestId: ${requestId} !== currentRequestId: ${this.currentRequestId}`
          : `成功请求 -> requestId: ${requestId} === currentRequestId: ${this.currentRequestId}`
      );

      if (requestId !== this.currentRequestId) {
        return neverPromise();
      }
      const error = err as Error;
      this.setState({ error });
      this.executePlugin("onError", error, this.state.params); // 执行插件的onError方法
      this.options.onError?.(error, this.state.params);
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
    await this.runAsync(...this.state.params);
  };

  cancel = () => {
    this.currentRequestId = 0; // 重置请求ID

    this.loading(false);

    this.executePlugin("onCancel");
  };
}
