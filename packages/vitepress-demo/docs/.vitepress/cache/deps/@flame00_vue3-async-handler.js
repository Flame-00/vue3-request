import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-YORUFTD3.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-DZZM6G22.js";

// ../../node_modules/.pnpm/@flame00+vue3-async-handler@1.0.13_typescript@5.8.3/node_modules/@flame00/vue3-async-handler/dist/vue3-async-handler.umd.js
var require_vue3_async_handler_umd = __commonJS({
  "../../node_modules/.pnpm/@flame00+vue3-async-handler@1.0.13_typescript@5.8.3/node_modules/@flame00/vue3-async-handler/dist/vue3-async-handler.umd.js"(exports, module) {
    (function(d, r) {
      typeof exports == "object" && typeof module < "u" ? r(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], r) : (d = typeof globalThis < "u" ? globalThis : d || self, r(d.Vue3AsyncHandler = {}, d.Vue));
    })(exports, function(d, r) {
      "use strict";
      const b = /* @__PURE__ */ new Map(), X = (n, { data: i, params: s, time: f }) => {
        b.set(n, { data: i, params: s, time: f });
      }, F = (n) => {
        if (n) return b.get(n);
        b.clear();
      }, H = (n) => {
        b.delete(n);
      }, v = /* @__PURE__ */ new Map(), Y = (n, { data: i, params: s, time: f }) => {
        var _a;
        v.has(n) && ((_a = v.get(n)) == null ? void 0 : _a.forEach((w) => w({ data: i, params: s, time: f })));
      }, N = (n, i) => {
        var _a;
        return v.has(n) || v.set(n, /* @__PURE__ */ new Set()), (_a = v.get(n)) == null ? void 0 : _a.add(i), () => {
          const s = v.get(n);
          s == null ? void 0 : s.delete(i), (s == null ? void 0 : s.size) === 0 && v.delete(n);
        };
      };
      function Z(n, i) {
        let s = null, f = null, h = 0, w = true, g = true, p = null, R = 0;
        const o = r.shallowRef(), D = r.shallowRef(false), E = r.shallowRef(false), m = r.shallowRef(false), C = r.shallowRef(null), a = r.shallowRef([]), O = {
          manual: false,
          defaultParams: [],
          errorRetryCount: 0,
          errorRetryInterval: 1e3 * Math.pow(2, h),
          refocusTimespan: 5e3,
          staleTime: (/* @__PURE__ */ new Date(0)).setMinutes(3),
          ...i
        }, {
          onBefore: j,
          onSuccess: x,
          onError: $,
          manual: V,
          defaultParams: I,
          refreshDeps: W,
          refreshDepsAction: z,
          pollingInterval: k,
          errorRetryCount: ee,
          errorRetryInterval: te,
          refreshOnWindowFocus: ne,
          refocusTimespan: re,
          cacheKey: u,
          staleTime: ae
        } = O;
        a.value = I;
        const B = (e) => (e == null ? void 0 : e.name) === "AbortError" || (e == null ? void 0 : e.code) === "ERR_CANCELED" || (e == null ? void 0 : e.name) === "CanceledError", T = () => {
          s && !s.signal.aborted && !E.value && (s.abort(), m.value = s.signal.aborted);
        }, se = () => {
          R++, P(false);
        };
        function P(e) {
          D.value = e, E.value = !e;
        }
        const le = () => (s = new AbortController(), m.value = s.signal.aborted, { signal: s.signal }), y = () => {
          M(...a.value);
        }, oe = async () => {
          await S(...a.value);
        }, K = () => {
          f && window.clearInterval(f);
        };
        function _(e) {
          return e === void 0 ? e : typeof e == "number" && !isNaN(e);
        }
        const ue = () => {
          const { is: e, value: t } = q(r.toValue(k));
          e && (K(), f = window.setInterval(y, t));
        }, G = (e) => new Promise((t) => setTimeout(t, e)), J = async () => {
          const { is: e, value: t } = q(r.toValue(te));
          e && (await G(t), y());
        }, ce = async () => {
          const { is: e, value: t } = q(r.toValue(ee), true);
          if (e)
            if (t === -1) await J();
            else {
              if (h++, h > t) {
                h = 0;
                return;
              }
              await J();
            }
        }, ie = () => {
          w = false;
        }, L = () => {
          var _a;
          P(B(o.value) && !m.value || false), (_a = O.onFinally) == null ? void 0 : _a.call(O, a.value, o.value, C.value);
        };
        function fe() {
          if (!u) return;
          const e = F(u);
          e && (o.value = e.data, a.value = e.params), p = N(u, (t) => {
            o.value = t.data, a.value = t.params;
          });
        }
        const de = () => {
          if (!u) return { isReturnRequest: false, cache: null };
          const e = F(u);
          return e ? Date.now() - e.time > ae ? (H(u), { isReturnRequest: false, cache: null }) : { isReturnRequest: true, cache: e } : { isReturnRequest: false, cache: null };
        };
        fe();
        const S = async (...e) => {
          he();
          const { cache: t, isReturnRequest: me } = de();
          if (me && t) {
            const { data: c, params: l } = t;
            return j == null ? void 0 : j(l), o.value = c, a.value = l, x == null ? void 0 : x(c, l), L(), c;
          }
          const Q = ++R;
          a.value = e.length ? e : I, T();
          const { signal: pe } = le();
          P(true), ue();
          try {
            j == null ? void 0 : j(a.value);
            const c = await n(pe)(...a.value);
            if (Q !== R) return;
            if (o.value = c, x == null ? void 0 : x(c, a.value), L(), u) {
              const l = { data: o.value, params: a.value, time: Date.now() };
              p == null ? void 0 : p(), p = N(u, (U) => {
                o.value = U.data, a.value = U.params;
              }), X(u, l), Y(u, l);
            }
            return c;
          } catch (c) {
            const l = c;
            if (Q !== R) return;
            throw C.value = B(l) && !m.value ? null : l, $ == null ? void 0 : $(l, a.value), w ? ce() : w = true, L(), l;
          }
        }, M = (...e) => {
          S(...e).catch((t) => {
          });
        };
        V || M(...I), W && r.watch(
          W,
          () => {
            if (z) return z();
            y();
          },
          { deep: true }
        );
        async function A() {
          const { is: e, value: t } = q(re);
          e && window.document.visibilityState === "visible" && navigator.onLine && g && (y(), g = false, await G(t), g = true);
        }
        function ve() {
          ne && (window.addEventListener("focus", A), window.document.addEventListener("visibilitychange", A));
        }
        ve();
        function q(e, t) {
          return _(e) === void 0 ? { is: false, value: 0 } : _(e) ? t && e === -1 ? { is: true, value: -1 } : { is: true, value: e === 0 || e && e < 0 ? 0 : e } : { is: false, value: 0 };
        }
        function he() {
          a.value = [], o.value = null, C.value = null, D.value = false, E.value = false, m.value = false;
        }
        function we() {
          s = null, f = null, p = null, w = true, g = true, h = 0, R = 0, window.removeEventListener("focus", A), window.document.removeEventListener("visibilitychange", A);
        }
        return r.onScopeDispose(
          () => {
            p == null ? void 0 : p(), T(), we();
          },
          r.version.startsWith("3.5") ? true : void 0
        ), {
          data: o,
          params: a,
          isLoading: D,
          isFinished: E,
          isAborted: m,
          error: C,
          cancel: se,
          abort: T,
          run: M,
          runAsync: S,
          refresh: y,
          refreshAsync: oe,
          cancelPolling: K,
          cancelErrorRetry: ie,
          clearCache: H
        };
      }
      d.useAsyncHandler = Z, Object.defineProperty(d, Symbol.toStringTag, { value: "Module" });
    });
  }
});
export default require_vue3_async_handler_umd();
//# sourceMappingURL=@flame00_vue3-async-handler.js.map
