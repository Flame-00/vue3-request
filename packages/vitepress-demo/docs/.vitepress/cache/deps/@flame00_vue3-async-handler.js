import {
  onScopeDispose,
  shallowRef,
  toValue,
  version,
  watch
} from "./chunk-GRXRH4YQ.js";
import "./chunk-PZ5AY32C.js";

// ../../node_modules/.pnpm/@flame00+vue3-async-handler@1.0.10_typescript@5.8.3/node_modules/@flame00/vue3-async-handler/dist/vue3-async-handler.es.js
var C = /* @__PURE__ */ new Map();
var Re = (n, { data: l, params: r, time: i }) => {
  C.set(n, { data: l, params: r, time: i });
};
var U = (n) => {
  if (n)
    return C.get(n);
  C.clear();
};
var X = (n) => {
  C.delete(n);
};
var c = /* @__PURE__ */ new Map();
var ye = (n, { data: l, params: r }) => {
  var _a;
  c.has(n) && ((_a = c.get(n)) == null ? void 0 : _a.forEach((f) => f({ data: l, params: r, time: Date.now() })));
};
var Y = (n, l) => {
  var _a;
  return c.has(n) || c.set(n, /* @__PURE__ */ new Set()), (_a = c.get(n)) == null ? void 0 : _a.add(l), () => {
    const r = c.get(n);
    r == null ? void 0 : r.delete(l), (r == null ? void 0 : r.size) === 0 && c.delete(n);
  };
};
function Ee(n, l) {
  let r = null, i = null, f = 0, A = true, D = true, v = null, R = null;
  const o = shallowRef(), I = shallowRef(false), b = shallowRef(false), d = shallowRef(false), L = shallowRef(null), s = shallowRef([]), S = {
    manual: false,
    defaultParams: [],
    errorRetryCount: 0,
    errorRetryInterval: 1e3 * Math.pow(2, f),
    // 错误重试间隔 指数增长
    refocusTimespan: 5e3,
    // 重新聚焦时间
    staleTime: (/* @__PURE__ */ new Date(0)).setMinutes(3),
    // 3分钟
    ...l
  }, { onBefore: N, onSuccess: O, onError: W, manual: Z, defaultParams: x, refreshDeps: z, refreshDepsAction: B, pollingInterval: k, errorRetryCount: V, errorRetryInterval: ee, refreshOnWindowFocus: te, refocusTimespan: ne, cacheKey: a, staleTime: re } = S, H = (e) => (e == null ? void 0 : e.name) === "AbortError" || (e == null ? void 0 : e.code) === "ERR_CANCELED" || (e == null ? void 0 : e.name) === "CanceledError", P = () => {
    r && !r.signal.aborted && !b.value && (r.abort(), d.value = r.signal.aborted);
  };
  function K(e) {
    I.value = e, b.value = !e;
  }
  const se = () => (r = new AbortController(), d.value = r.signal.aborted, {
    signal: r.signal
  }), y = () => {
    F(...s.value);
  }, ae = async () => {
    await T(...s.value);
  }, _ = () => {
    i && window.clearInterval(i);
  };
  function $(e) {
    return e === void 0 ? e : typeof e == "number" && !isNaN(e);
  }
  const le = () => {
    const { is: e, value: t } = g(toValue(k));
    e && (_(), i = window.setInterval(y, t));
  }, j = (e) => new Promise((t) => setTimeout(t, e)), G = async () => {
    const { is: e, value: t } = g(toValue(ee));
    e && (await j(t), y());
  }, oe = async () => {
    const { is: e, value: t } = g(toValue(V), true);
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
  }, ue = () => {
    A = false;
  }, q = (e) => {
    var _a;
    K(H(e) && !d.value || false), (_a = S.onFinally) == null ? void 0 : _a.call(S, {
      data: e,
      params: s.value
    }), v = null;
  };
  function ie() {
    if (!a) return;
    const e = U(a);
    e && (o.value = e.data, s.value = e.params), R = Y(a, (t) => {
      o.value = t.data, s.value = t.params;
    });
  }
  const ce = () => {
    if (!a) return {
      // 没有设置缓存key
      isReturnRequest: false
    };
    const e = U(a);
    return e ? Date.now() - e.time > re ? (X(a), {
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
  const T = async (...e) => {
    const { cache: t, isReturnRequest: de } = ce();
    if (de && t) {
      const { data: m, params: w } = t;
      return N == null ? void 0 : N(w), o.value = m, w.value = w, O == null ? void 0 : O(m, w), q(m), m;
    }
    if (v)
      return v;
    J(), s.value = e.length ? e : x, P();
    const { signal: me } = se();
    return K(true), le(), v = new Promise((m, w) => {
      (async () => {
        try {
          N == null ? void 0 : N(s.value);
          const h = await n(me)(...s.value);
          if (o.value = h, O == null ? void 0 : O(h, s.value), m(h), q(h), a) {
            const u = { data: o.value, params: s.value, time: Date.now() };
            R == null ? void 0 : R(), R = Y(a, (Q) => {
              o.value = Q.data, s.value = Q.params;
            }), Re(a, u), ye(a, u);
          }
        } catch (h) {
          const u = h;
          L.value = H(u) && !d.value ? null : u, W == null ? void 0 : W(u, s.value), A ? oe() : A = true, w(u), q(u);
        }
      })();
    }), v;
  }, F = (...e) => {
    T(...e).catch((t) => {
      W || console.error(t);
    });
  };
  Z || F(...x), z && watch(
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
  async function E() {
    const { is: e, value: t } = g(ne);
    e && window.document.visibilityState === "visible" && navigator.onLine && D && (y(), D = false, await j(t), D = true);
  }
  function fe() {
    te && (window.addEventListener("focus", E), window.document.addEventListener("visibilitychange", E));
  }
  fe();
  function g(e, t) {
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
  function J() {
    s.value = [], o.value = null, L.value = null, I.value = false, b.value = false, d.value = false;
  }
  function ve() {
    r = null, i = null, v = null, R = null, window.removeEventListener("focus", E), window.document.removeEventListener("visibilitychange", E);
  }
  return onScopeDispose(() => {
    R == null ? void 0 : R(), P(), J(), ve();
  }, version.startsWith("3.5") ? true : void 0), {
    data: o,
    params: s,
    isLoading: I,
    isFinished: b,
    isAborted: d,
    error: L,
    abort: P,
    run: F,
    runAsync: T,
    refresh: y,
    refreshAsync: ae,
    cancelPolling: _,
    cancelErrorRetry: ue,
    clearCache: X
  };
}
export {
  Ee as useAsyncHandler
};
//# sourceMappingURL=@flame00_vue3-async-handler.js.map
