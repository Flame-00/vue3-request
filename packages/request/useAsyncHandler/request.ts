import type { CallbackType, IOptions, IState, PluginReturn } from "./types";
import { reactive } from "vue";

export class Request<D, P extends any[]> {
  currentRequestId: number = 0;

  pluginImpls: PluginReturn<D, P>[] = [];

  state: IState<D, P>;

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

  executePlugin = (event: keyof PluginReturn<D, P>, ...rest: any[]) => {
    // 执行插件里的方法
    const r = this.pluginImpls.map((plugin) => plugin[event]?.apply(plugin, rest)).filter(Boolean);
    return Object.assign({}, ...r);
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

    this.loading(true);

    params.length && this.setState({ params });

    const { signal, returnNow } = this.executePlugin(
      "onBefore",
      this.state.params
    ); // 执行插件的onBefore方法

    console.log(444, returnNow);

    if (returnNow) {
      return this.state.data;
    }

    this.options.onBefore?.(this.state.params);

    try {
      const res = await this.service(signal)(...this.state.params);

      if (requestId !== this.currentRequestId) {
        return new Promise(() => { });
      }

      this.setState({ data: res });

      this.executePlugin("onSuccess", res, this.state.params); // 执行插件的onSuccess方法

      this.options.onSuccess?.(res, this.state.params);

      this.onFinished();

      return res;
    } catch (err) {
      if (requestId !== this.currentRequestId) {
        return new Promise(() => { });
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
