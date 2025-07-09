import {
  onScopeDispose,
  shallowRef,
  toValue,
  version,
  watch
} from "./chunk-GRXRH4YQ.js";
import "./chunk-PZ5AY32C.js";

// ../../node_modules/.pnpm/@flame00+vue3-async-handler@1.0.12_typescript@5.8.3/node_modules/@flame00/vue3-async-handler/dist/vue3-async-handler.es.js
var A = /* @__PURE__ */ new Map();
var Re = (n, { data: o, params: r, time: u }) => {
  A.set(n, { data: o, params: r, time: u });
};
var U = (n) => {
  if (n)
    return A.get(n);
  A.clear();
};
var X = (n) => {
  A.delete(n);
};
var c = /* @__PURE__ */ new Map();
var ye = (n, { data: o, params: r }) => {
  var _a;
  c.has(n) && ((_a = c.get(n)) == null ? void 0 : _a.forEach((f) => f({ data: o, params: r, time: Date.now() })));
};
var Y = (n, o) => {
  var _a;
  return c.has(n) || c.set(n, /* @__PURE__ */ new Set()), (_a = c.get(n)) == null ? void 0 : _a.add(o), () => {
    const r = c.get(n);
    r == null ? void 0 : r.delete(o), (r == null ? void 0 : r.size) === 0 && c.delete(n);
  };
};
function Ee(n, o) {
  let r = null, u = null, f = 0, D = true, I = true, v = null, h = null;
  const s = shallowRef(), L = shallowRef(false), b = shallowRef(false), d = shallowRef(false), E = shallowRef(null), a = shallowRef([]), S = {
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
  }, { onBefore: N, onSuccess: O, onError: W, manual: Z, defaultParams: x, refreshDeps: z, refreshDepsAction: B, pollingInterval: k, errorRetryCount: V, errorRetryInterval: ee, refreshOnWindowFocus: te, refocusTimespan: ne, cacheKey: l, staleTime: re } = S, H = (e) => (e == null ? void 0 : e.name) === "AbortError" || (e == null ? void 0 : e.code) === "ERR_CANCELED" || (e == null ? void 0 : e.name) === "CanceledError", P = () => {
    r && !r.signal.aborted && !b.value && (r.abort(), d.value = r.signal.aborted);
  };
  function K(e) {
    L.value = e, b.value = !e;
  }
  const ae = () => (r = new AbortController(), d.value = r.signal.aborted, {
    signal: r.signal
  }), p = () => {
    F(...a.value);
  }, se = async () => {
    await T(...a.value);
  }, _ = () => {
    u && window.clearInterval(u);
  };
  function $(e) {
    return e === void 0 ? e : typeof e == "number" && !isNaN(e);
  }
  const le = () => {
    const { is: e, value: t } = C(toValue(k));
    e && (_(), u = window.setInterval(p, t));
  }, j = (e) => new Promise((t) => setTimeout(t, e)), G = async () => {
    const { is: e, value: t } = C(toValue(ee));
    e && (await j(t), p());
  }, oe = async () => {
    const { is: e, value: t } = C(toValue(V), true);
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
    D = false;
  }, q = () => {
    var _a;
    K(H(s.value) && !d.value || false), (_a = S.onFinally) == null ? void 0 : _a.call(S, {
      data: s.value,
      params: a.value,
      error: E.value
    }), v = null;
  };
  function ie() {
    if (!l) return;
    const e = U(l);
    e && (s.value = e.data, a.value = e.params), h = Y(l, (t) => {
      s.value = t.data, a.value = t.params;
    });
  }
  const ce = () => {
    if (!l) return {
      // 没有设置缓存key
      isReturnRequest: false
    };
    const e = U(l);
    return e ? Date.now() - e.time > re ? (X(l), {
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
    J();
    const { cache: t, isReturnRequest: de } = ce();
    if (de && t) {
      const { data: R, params: m } = t;
      return N == null ? void 0 : N(m), s.value = R, m.value = m, O == null ? void 0 : O(R, m), q(), R;
    }
    if (v)
      return v;
    a.value = e.length ? e : x, P();
    const { signal: me } = ae();
    return K(true), le(), v = new Promise((R, m) => {
      (async () => {
        try {
          N == null ? void 0 : N(a.value);
          const y = await n(me)(...a.value);
          if (s.value = y, O == null ? void 0 : O(y, a.value), R(y), q(), l) {
            const i = { data: s.value, params: a.value, time: Date.now() };
            h == null ? void 0 : h(), h = Y(l, (Q) => {
              s.value = Q.data, a.value = Q.params;
            }), Re(l, i), ye(l, i);
          }
        } catch (y) {
          const i = y;
          E.value = H(i) && !d.value ? null : i, W == null ? void 0 : W(i, a.value), D ? oe() : D = true, m(i), q();
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
      p();
    },
    {
      deep: true
    }
  );
  async function g() {
    const { is: e, value: t } = C(ne);
    e && window.document.visibilityState === "visible" && navigator.onLine && I && (p(), I = false, await j(t), I = true);
  }
  function fe() {
    te && (window.addEventListener("focus", g), window.document.addEventListener("visibilitychange", g));
  }
  fe();
  function C(e, t) {
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
    a.value = [], s.value = null, E.value = null, L.value = false, b.value = false, d.value = false;
  }
  function ve() {
    r = null, u = null, v = null, h = null, window.removeEventListener("focus", g), window.document.removeEventListener("visibilitychange", g);
  }
  return onScopeDispose(() => {
    h == null ? void 0 : h(), P(), J(), ve();
  }, version.startsWith("3.5") ? true : void 0), {
    data: s,
    params: a,
    isLoading: L,
    isFinished: b,
    isAborted: d,
    error: E,
    abort: P,
    run: F,
    runAsync: T,
    refresh: p,
    refreshAsync: se,
    cancelPolling: _,
    cancelErrorRetry: ue,
    clearCache: X
  };
}
export {
  Ee as useAsyncHandler
};
//# sourceMappingURL=@flame00_vue3-async-handler.js.map
