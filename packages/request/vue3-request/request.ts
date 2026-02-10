import type {
  ServiceType,
  BaseOptions,
  IState,
  PluginMethodsReturn,
  PluginReturn,
} from "./types";
import { reactive } from "vue";
import { composeMiddleware, neverPromise, isNil } from "./utils";
export class Request<D, P extends any[]> {
  currentRequestId: number = 0;

  pluginImpls: PluginReturn<D, P>[] = [];

  state: IState<D, P>;

  abort: () => void = () => {};

  constructor(
    public service: ServiceType<D, P>,
    public options: BaseOptions<D, P> & { resKey: keyof D }
  ) {
    // @ts-ignore
    this.state = reactive({
      data: undefined,
      res: undefined,
      error: undefined,
      params: options?.defaultParams || [],
      loading: false,
      isFinished: false,
      isAborted: false,
      signal: new AbortController().signal,
    });
  }
  setState = (s: Partial<IState<D, P>>) => {
    Object.assign(this.state, s);

    if (s.data && typeof s.data === "object" && !isNil(s.data)) {
      const resKey = this.options.resKey || "data";
      if (Reflect.has(s.data, resKey)) {
        // @ts-ignore
        this.state.res = s.data[resKey];
      }
    }
    console.log("res", this.state.res);
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
  loading = (loading: boolean) => {
    this.setState({ loading, isFinished: !loading });
  };
  onFinished = () => {
    this.executePlugin(
      "onFinally",
      this.state.params
      // this.state.data,
      // this.state.error
    );
    this.loading(false);
    this.options.onFinally?.(
      this.state.params
      // this.state.data,
      // this.state.error
    );
  };
  runAsync = async (...params: P): Promise<D> => {
    const requestId = ++this.currentRequestId;

    const { isReturn, isReady, ...rest } = this.executePlugin(
      "onBefore",
      params
    );

    if (!isReady) {
      return neverPromise();
    }
    this.setState({ params, ...rest });
    this.loading(true);

    if (isReturn) {
      this.loading(false);
      return rest.data!;
    }
    this.options.onBefore?.(params);

    try {
      const serviceWrapper = () => this.service(...params);

      let { servicePromise } = this.executePlugin("onRequest", serviceWrapper);

      // 如果onRequest没有返回servicePromise，则使用原始service
      if (!servicePromise) {
        servicePromise = serviceWrapper();
      }
      this.setState({ data: await servicePromise, error: undefined });

      if (requestId !== this.currentRequestId) {
        return neverPromise();
      }
      this.executePlugin("onSuccess", params);
      // this.options.onSuccess?.(this.state.data!, params);
      this.options.onSuccess?.(params);
      this.onFinished();

      return this.state.data!;
    } catch (err) {
      if (requestId !== this.currentRequestId) {
        return neverPromise();
      }
      this.setState({ data: undefined, res: undefined, error: err as Error });
      // this.executePlugin("onError", this.state.error!, params);
      this.executePlugin("onError", params);
      // this.options.onError?.(this.state.error!, params);
      this.options.onError?.(params);
      this.onFinished();

      throw this.state.error!;
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

  // mutate = (data: D | ((data: D) => D)) => {
  //   if (isFunction(data)) {
  //     this.setState({ data: data(this.state.data!) });
  //   } else {
  //     this.setState({ data });
  //   }
  //   this.executePlugin("onMutate", this.state.data);
  // };

  cancel = () => {
    this.executePlugin("onCancel");
    this.currentRequestId++;
    this.loading(false);
  };
}
