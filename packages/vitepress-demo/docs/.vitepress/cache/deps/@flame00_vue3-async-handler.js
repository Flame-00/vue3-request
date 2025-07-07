import {
  onScopeDispose,
  shallowRef,
  toValue,
  version,
  watch
} from "./chunk-GRXRH4YQ.js";
import "./chunk-PZ5AY32C.js";

// ../../node_modules/.pnpm/@flame00+vue3-async-handler@1.0.7_typescript@5.8.3/node_modules/@flame00/vue3-async-handler/dist/vue3-async-handler.es.js
var g = /* @__PURE__ */ new Map();
var pe = (n, { data: o, params: r, time: i }) => {
  g.set(n, { data: o, params: r, time: i });
};
var Q = (n) => {
  if (n)
    return g.get(n);
  g.clear();
};
var U = (n) => {
  g.delete(n);
};
var u = /* @__PURE__ */ new Map();
var Re = (n, { data: o, params: r }) => {
  var _a;
  u.has(n) && ((_a = u.get(n)) == null ? void 0 : _a.forEach((f) => f({ data: o, params: r, time: Date.now() })));
};
var X = (n, o) => {
  var _a;
  return u.has(n) || u.set(n, /* @__PURE__ */ new Set()), (_a = u.get(n)) == null ? void 0 : _a.add(o), () => {
    const r = u.get(n);
    r == null ? void 0 : r.delete(o), (r == null ? void 0 : r.size) === 0 && u.delete(n);
  };
};
function be(n, o) {
  let r = null, i = null, f = 0, C = true, A = true, v = null, p = null;
  const c = shallowRef(), F = shallowRef(false), D = shallowRef(false), R = shallowRef(false), M = shallowRef(null), s = shallowRef([]), S = {
    manual: false,
    defaultParams: [],
    errorRetryCount: 0,
    errorRetryInterval: 1e3 * Math.pow(2, f),
    // 错误重试间隔 指数增长
    refocusTimespan: 5e3,
    // 重新聚焦时间
    staleTime: (/* @__PURE__ */ new Date(0)).setMinutes(3),
    // 3分钟
    ...o
  }, { onBefore: N, onSuccess: O, onError: W, manual: Y, defaultParams: x, refreshDeps: z, refreshDepsAction: B, pollingInterval: Z, errorRetryCount: k, errorRetryInterval: V, refreshOnWindowFocus: ee, refocusTimespan: te, cacheKey: a, staleTime: ne } = S, H = (e) => (e == null ? void 0 : e.name) === "AbortError" || (e == null ? void 0 : e.code) === "ERR_CANCELED" || (e == null ? void 0 : e.name) === "CanceledError", I = () => {
    r && !r.signal.aborted && !D.value && (r.abort(), R.value = r.signal.aborted);
  };
  function K(e) {
    F.value = e, D.value = !e;
  }
  const re = () => (r = new AbortController(), R.value = r.signal.aborted, {
    signal: r.signal
  }), y = () => {
    q(...s.value);
  }, se = async () => {
    await P(...s.value);
  }, _ = () => {
    i && window.clearInterval(i);
  };
  function $(e) {
    return e === void 0 ? e : typeof e == "number" && !isNaN(e);
  }
  const ae = () => {
    const { is: e, value: t } = E(toValue(Z));
    e && (_(), i = window.setInterval(y, t));
  }, j = (e) => new Promise((t) => setTimeout(t, e)), G = async () => {
    const { is: e, value: t } = E(toValue(V));
    e && (await j(t), y());
  }, oe = async () => {
    const { is: e, value: t } = E(toValue(k), true);
    if (e)
      if (t === -1)
        await G();
      else {
        if (f++, f > t) {
          f = 0;
          return;
        }
        await G();
      }
  }, le = () => {
    C = false;
  }, L = (e) => {
    var _a;
    K(H(e) && !R.value || false), (_a = S.onFinally) == null ? void 0 : _a.call(S, {
      data: e,
      params: s.value
    }), v = null;
  };
  function ie() {
    if (!a) return;
    const e = Q(a);
    e && (c.value = e.data, s.value = e.params), p = X(a, (t) => {
      c.value = t.data, s.value = t.params;
    });
  }
  const ce = () => {
    if (!a) return {
      // 没有设置缓存key
      isReturnRequest: false
    };
    const e = Q(a);
    return e ? Date.now() - e.time > ne ? (U(a), {
      isReturnRequest: false,
      cache: null
    }) : {
      isReturnRequest: true,
      cache: e
    } : {
      isReturnRequest: false,
      cache: null
    };
  };
  ie();
  const P = async (...e) => {
    const { cache: t, isReturnRequest: ve } = ce();
    if (ve && t) {
      const { data: d, params: m } = t;
      return N == null ? void 0 : N(m), c.value = d, m.value = m, O == null ? void 0 : O(d, m), L(d), d;
    }
    if (v)
      return v;
    s.value = e.length ? e : x, I();
    const { signal: de } = re();
    return K(true), ae(), v = new Promise((d, m) => {
      (async () => {
        try {
          N == null ? void 0 : N(s.value);
          const w = await n(de)(...s.value);
          if (c.value = w, O == null ? void 0 : O(w, s.value), d(w), L(w), a) {
            const l = { data: c.value, params: s.value, time: Date.now() };
            p == null ? void 0 : p(), p = X(a, (J) => {
              c.value = J.data, s.value = J.params;
            }), pe(a, l), Re(a, l);
          }
        } catch (w) {
          const l = w;
          M.value = H(l) && !R.value ? null : l, W == null ? void 0 : W(l, s.value), C ? oe() : C = true, m(l), L(l);
        }
      })();
    }), v;
  }, q = (...e) => {
    P(...e).catch((t) => {
      W || console.error(t);
    });
  };
  Y || q(...x), z && watch(
    z,
    () => {
      if (B)
        return B();
      y();
    },
    {
      deep: true
    }
  );
  async function b() {
    const { is: e, value: t } = E(te);
    e && window.document.visibilityState === "visible" && navigator.onLine && A && (y(), A = false, await j(t), A = true);
  }
  function ue() {
    ee && (window.addEventListener("focus", b), window.document.addEventListener("visibilitychange", b));
  }
  ue();
  function E(e, t) {
    return $(e) === void 0 ? {
      is: false,
      value: 0
    } : $(e) ? t && e === -1 ? {
      is: true,
      value: -1
    } : {
      is: true,
      value: e === 0 || e && e < 0 ? 0 : e
    } : (console.error(`${e} is not a number`), {
      is: false,
      value: 0
    });
  }
  const fe = () => {
    r = null, i = null, v = null, p = null, window.removeEventListener("focus", b), window.document.removeEventListener("visibilitychange", b);
  };
  return onScopeDispose(() => {
    p == null ? void 0 : p(), I(), fe();
  }, version.startsWith("3.5") ? true : void 0), {
    data: c,
    params: s,
    isLoading: F,
    isFinished: D,
    isAborted: R,
    error: M,
    abort: I,
    run: q,
    runAsync: P,
    refresh: y,
    refreshAsync: se,
    cancelPolling: _,
    cancelErrorRetry: le,
    clearCache: U
  };
}
export {
  be as useAsyncHandler
};
//# sourceMappingURL=@flame00_vue3-async-handler.js.map
