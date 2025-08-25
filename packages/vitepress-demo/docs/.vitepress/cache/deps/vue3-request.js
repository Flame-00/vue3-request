import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-7M3ZLALO.js";
import {
  __commonJS,
  __publicField,
  __toCommonJS
} from "./chunk-BYYN2XO5.js";

// ../../node_modules/.pnpm/vue3-request@1.0.21_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js
var require_vue3_request_umd = __commonJS({
  "../../node_modules/.pnpm/vue3-request@1.0.21_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js"(exports, module) {
    (function(b, s) {
      typeof exports == "object" && typeof module < "u" ? s(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], s) : (b = typeof globalThis < "u" ? globalThis : b || self, s(b.Vue3Request = {}, b.Vue));
    })(exports, function(b, s) {
      "use strict";
      const v = (t) => t, V = (t) => t == null;
      function E(t) {
        return V(t) ? t : typeof t == "number" && !isNaN(t);
      }
      function p(t, e) {
        return E(t) === void 0 ? { is: false, value: 0 } : E(t) ? e && t === -1 ? { is: true, value: -1 } : { is: true, value: t === 0 || t && t < 0 ? 0 : t } : { is: false, value: 0 };
      }
      const M = (t, e) => {
        let n = e;
        for (let i = t.length; i-- > 0; ) {
          const r = t[i];
          n = r(n);
        }
        return n == null ? void 0 : n();
      }, T = () => new Promise(() => {
      }), O = (t) => t instanceof Function, P = /* @__PURE__ */ new Map(), j = (t, e, { data: n, params: i, time: r }) => {
        let a;
        const o = q(t), { is: l, value: u } = p(e, true);
        l && ((o == null ? void 0 : o.timer) && window.clearTimeout(o == null ? void 0 : o.timer), u !== -1 && (a = window.setTimeout(() => {
          F(t);
        }, u)), P.set(t, { data: n, params: i, time: r, timer: a }));
      }, q = (t) => P.get(t), F = (t) => {
        t && typeof t == "string" ? P.delete(t) : P.clear();
      };
      class L {
        constructor(e, n) {
          __publicField(this, "currentRequestId", 0);
          __publicField(this, "pluginImpls", []);
          __publicField(this, "state");
          __publicField(this, "abort", () => {
          });
          __publicField(this, "setState", (e) => {
            Object.assign(this.state, e);
          });
          __publicField(this, "executePlugin", (e, ...n) => {
            if (e === "onRequest") return { servicePromise: M(this.pluginImpls.map((r) => r.onRequest).filter(Boolean), n[0]) };
            {
              const i = this.pluginImpls.map((r) => {
                var _a;
                return (_a = r[e]) == null ? void 0 : _a.call(r, ...n);
              }).filter(Boolean);
              return Object.assign({}, ...i);
            }
          });
          __publicField(this, "loading", (e) => {
            this.setState({ loading: e, isFinished: !e });
          });
          __publicField(this, "onFinished", () => {
            var _a, _b;
            this.executePlugin("onFinally", this.state.params, this.state.data, this.state.error), this.loading(false), (_b = (_a = this.options).onFinally) == null ? void 0 : _b.call(_a, this.state.params, this.state.data, this.state.error);
          });
          __publicField(this, "runAsync", async (...e) => {
            var _a, _b, _c, _d, _e, _f;
            const n = ++this.currentRequestId, { isReturn: i, isReady: r, ...a } = this.executePlugin("onBefore", e);
            if (!r) return T();
            if (this.setState({ params: e }), this.loading(true), i) return this.loading(a.loading || false), a.data;
            (_b = (_a = this.options).onBefore) == null ? void 0 : _b.call(_a, e);
            try {
              const o = () => this.service(...e);
              let { servicePromise: l } = this.executePlugin("onRequest", o);
              l || (l = o());
              const u = await l;
              return n !== this.currentRequestId ? T() : (this.setState({ data: u, error: void 0 }), this.executePlugin("onSuccess", u, e), (_d = (_c = this.options).onSuccess) == null ? void 0 : _d.call(_c, u, e), this.onFinished(), u);
            } catch (o) {
              if (n !== this.currentRequestId) return T();
              const l = o;
              throw this.setState({ data: void 0, error: l }), this.executePlugin("onError", l, e), (_f = (_e = this.options).onError) == null ? void 0 : _f.call(_e, l, e), this.onFinished(), l;
            }
          });
          __publicField(this, "run", (...e) => {
            this.runAsync(...e).catch((n) => {
              this.options.onError;
            });
          });
          __publicField(this, "refresh", () => {
            this.run(...this.state.params);
          });
          __publicField(this, "refreshAsync", async () => await this.runAsync(...this.state.params));
          __publicField(this, "mutate", (e) => {
            O(e) ? e(this.state.data) : this.setState({ data: e }), this.executePlugin("onMutate", this.state.data);
          });
          __publicField(this, "cancel", () => {
            this.executePlugin("onCancel"), this.currentRequestId++, this.loading(false);
          });
          this.service = e, this.options = n, this.state = s.reactive({ data: void 0, error: void 0, params: (n == null ? void 0 : n.defaultParams) || [], loading: false, isFinished: false, isAborted: false, signal: new AbortController().signal });
        }
      }
      function N(t, e, n) {
        const i = { manual: false, ...e }, r = new L(t, i);
        r.pluginImpls = n.map((m) => m(r, i)), s.onMounted(() => {
          if (!i.manual) {
            const m = r.state.params;
            r.run(...m);
          }
        }), s.onUnmounted(r.cancel);
        const { run: a, cancel: o, refresh: l, runAsync: u, refreshAsync: g, abort: f, mutate: h } = r;
        return { ...s.toRefs(r.state), run: a, cancel: o, refresh: l, runAsync: u, mutate: h, abort: f, refreshAsync: g, clearCache: F };
      }
      const U = v((t, { abortPrevious: e = true }) => {
        let n = null;
        const i = () => {
          n = new AbortController(), t.setState({ signal: n.signal, isAborted: n.signal.aborted });
        };
        return t.abort = () => {
          n && !n.signal.aborted && !t.state.isFinished && (n.abort(), t.setState({ isAborted: n.signal.aborted }));
        }, { onBefore: () => {
          typeof e == "boolean" && e && t.abort(), i();
        }, onRequest: (r) => () => r(), onCancel: () => {
          t.abort(), n = null;
        } };
      }), R = /* @__PURE__ */ new Map(), D = (t, { data: e, params: n, time: i }) => {
        var _a;
        R.has(t) && ((_a = R.get(t)) == null ? void 0 : _a.forEach((a) => a({ data: e, params: n, time: i })));
      }, x = (t, e) => {
        var _a;
        return R.has(t) ? (_a = R.get(t)) == null ? void 0 : _a.add(e) : R.set(t, /* @__PURE__ */ new Set()), () => {
          const n = R.get(t);
          n == null ? void 0 : n.delete(e), (n == null ? void 0 : n.size) === 0 && R.delete(t);
        };
      }, C = /* @__PURE__ */ new Map(), W = (t, e) => {
        C.set(t, e), e.then((n) => {
        }).catch(() => {
        }).finally(() => {
          _(t);
        });
      }, H = (t) => C.get(t), _ = (t) => {
        t && typeof t == "string" ? C.delete(t) : C.clear();
      }, $ = v((t, { cacheKey: e, cacheTime: n = 3e5, staleTime: i = 0, setCache: r, getCache: a }) => {
        const o = s.ref(null);
        let l = null;
        const { is: u, value: g } = p(i, true);
        if (!u) return {};
        const f = (c, d) => {
          r ? r(c, d) : j(c, n, d), D(c, d);
        }, h = (c) => a ? a(c) : q(c);
        function m() {
          if (!e) return;
          const c = h(e);
          c && Reflect.has(c, "data") && t.setState({ data: c.data, params: c.params }), o.value = x(e, (d) => {
            t.setState({ data: d.data });
          });
        }
        return m(), s.onUnmounted(() => {
          var _a;
          (_a = o.value) == null ? void 0 : _a.call(o);
        }), { onBefore: () => {
          if (!e) return null;
          const c = h(e);
          return !c || !Reflect.has(c, "data") ? {} : g === -1 || Date.now() - c.time < g ? { loading: false, data: c.data, error: void 0, isReturn: true } : { data: c.data, error: void 0 };
        }, onRequest: (c) => {
          if (!e) return c;
          let d = H(e);
          return d && d !== l ? () => d : (d = c(), l = d, W(e, d), () => d);
        }, onSuccess: (c, d) => {
          var _a;
          if (!e) return;
          const w = { data: c, params: d, time: Date.now() };
          (_a = o.value) == null ? void 0 : _a.call(o), f(e, w), o.value = x(e, (it) => {
            t.setState({ data: it.data });
          });
        } };
      }), z = v((t, { errorRetryCount: e = 0, errorRetryInterval: n }) => {
        const i = s.ref(), r = s.ref(0), a = s.ref(false), o = s.computed(() => 1e3 * Math.pow(2, r.value)), l = () => {
          let f = null;
          r.value++;
          const { value: h } = p(s.toValue(e), true), m = h === -1, c = r.value <= h;
          if (m || c) {
            let { is: d, value: w } = p(s.toValue(n));
            d || (w = s.toValue(Math.min(o.value, 3e4))), f = window.setTimeout(() => {
              a.value = true, t.refresh();
            }, w);
          }
          return () => {
            f && window.clearTimeout(f);
          };
        }, u = () => {
          var _a;
          (_a = i.value) == null ? void 0 : _a.call(i);
        }, { is: g } = p(s.toValue(e), true);
        return g ? { onBefore: () => {
          a.value || (r.value = 0), a.value = false, u();
        }, onSuccess: () => {
          r.value = 0;
        }, onError: () => {
          i.value = l();
        }, onCancel: () => {
          r.value = 0, u();
        } } : {};
      }), S = () => document.visibilityState === "visible", y = /* @__PURE__ */ new Set(), I = (t) => (y.add(t), () => {
        y.delete(t);
      }), J = () => {
        S() && y.forEach((t) => {
          t();
        });
      };
      window.addEventListener("visibilitychange", J, false);
      const Q = v((t, { pollingInterval: e, pollingWhenHidden: n = true, errorRetryCount: i }) => {
        const r = s.ref(null), a = s.ref(), o = () => {
          let l;
          const { value: u } = p(s.toValue(i), true);
          if (t.state.error && u !== 0) return;
          const { is: g, value: f } = p(s.toValue(e));
          if (!g) return;
          const h = f;
          return l = window.setTimeout(() => {
            !s.toValue(n) && !S() ? r.value = I(t.refresh) : t.refresh();
          }, h), () => {
            var _a;
            l && window.clearTimeout(l), (_a = r.value) == null ? void 0 : _a.call(r);
          };
        };
        return s.watch([() => s.toValue(e), () => s.toValue(n)], () => {
          var _a;
          (_a = a.value) == null ? void 0 : _a.call(a), a.value = o();
        }), s.onUnmounted(() => {
          var _a;
          (_a = r.value) == null ? void 0 : _a.call(r);
        }), { onBefore: () => {
          var _a;
          (_a = a.value) == null ? void 0 : _a.call(a);
        }, onCancel: () => {
          var _a;
          (_a = a.value) == null ? void 0 : _a.call(a);
        }, onFinally: () => {
          a.value = o();
        } };
      }), X = v((t, { manual: e, refreshDeps: n, refreshDepsAction: i }) => {
        if (V(n) || typeof n != "object" && typeof n != "function") return {};
        const r = s.watch(n, () => {
          e || (i ? i() : t.refresh());
        }, { deep: true });
        return { onCancel: () => {
          r();
        } };
      }), Y = () => window.navigator.onLine, A = /* @__PURE__ */ new Set(), Z = (t) => (A.add(t), () => {
        A.delete(t);
      }), B = () => {
        !S() || !Y() || A.forEach((t) => {
          t();
        });
      };
      window.addEventListener("visibilitychange", B, false), window.addEventListener("focus", B, false);
      const G = v((t, { refocusTimespan: e = 5e3, refreshOnWindowFocus: n = false }) => {
        const i = s.ref(), { is: r } = p(s.toValue(e));
        if (!r || V(s.toValue(n)) || typeof s.toValue(n) != "boolean") return {};
        const a = (o, l) => {
          let u = false;
          return () => {
            u || (u = true, o(), window.setTimeout(() => {
              u = false;
            }, l));
          };
        };
        return s.watchEffect(() => {
          var _a;
          (_a = i.value) == null ? void 0 : _a.call(i), s.toValue(n) && (i.value = Z(a(t.refresh, s.toValue(e))));
        }), s.onUnmounted(() => {
          var _a;
          (_a = i.value) == null ? void 0 : _a.call(i);
        }), {};
      }), k = v((t, { manual: e, ready: n = true, defaultParams: i = [] }) => {
        const r = s.watch(() => s.toValue(n), (a) => {
          !e && a && t.run(...i);
        }, { flush: "sync" });
        return { onBefore: () => ({ isReady: s.toValue(n) }), onCancel: () => {
          r();
        } };
      });
      function K(t, e, n) {
        var i = null, r = null, a = typeof n == "boolean" ? { leading: n, trailing: !n } : Object.assign({ leading: false, trailing: true }, n), o = false, l = null, u = a.leading, g = a.trailing, f = function() {
          i = null, r = null;
        }, h = function() {
          o = true, t.apply(r, i), f();
        }, m = function() {
          if (u === true && (l = null), o) {
            f();
            return;
          }
          if (g === true) {
            h();
            return;
          }
          f();
        }, c = function() {
          var w = l !== null;
          return w && clearTimeout(l), f(), l = null, o = false, w;
        }, d = function() {
          o = false, i = arguments, r = this, l === null ? u === true && h() : clearTimeout(l), l = setTimeout(m, e);
        };
        return d.cancel = c, d;
      }
      const tt = v((t, { debounceWait: e, debounceOptions: n, manual: i }) => {
        const r = s.ref(false);
        let a = null;
        const o = t.runAsync;
        return i || (r.value = true), s.watchEffect(() => {
          const { is: l, value: u } = p(s.toValue(e));
          if (!l) return;
          const g = s.toValue(n);
          a = K((f) => f(), u, g), t.runAsync = (...f) => new Promise((h, m) => {
            r.value ? (r.value = false, o(...f).then(h).catch(m)) : a(() => {
              o(...f).then(h).catch(m);
            });
          }), s.onWatcherCleanup(() => {
            a == null ? void 0 : a.cancel(), t.runAsync = o;
          });
        }), { onCancel: () => {
          a == null ? void 0 : a.cancel();
        } };
      });
      function et(t, e, n) {
        var i = null, r = null, a = false, o = null, l = Object.assign({ leading: true, trailing: true }, n), u = l.leading, g = l.trailing, f = function() {
          i = null, r = null;
        }, h = function() {
          a = true, t.apply(r, i), o = setTimeout(m, e), f();
        }, m = function() {
          if (o = null, a) {
            f();
            return;
          }
          if (g === true) {
            h();
            return;
          }
          f();
        }, c = function() {
          var w = o !== null;
          return w && clearTimeout(o), f(), o = null, a = false, w;
        }, d = function() {
          if (i = arguments, r = this, a = false, o === null && u === true) {
            h();
            return;
          }
          g === true && (o = setTimeout(m, e));
        };
        return d.cancel = c, d;
      }
      const nt = v((t, { throttleWait: e, throttleOptions: n }) => {
        let i = null;
        const r = t.runAsync;
        return s.watchEffect(() => {
          const { is: a, value: o } = p(s.toValue(e));
          if (!a) return;
          const l = s.toValue(n);
          i = et((u) => u(), o, l), t.runAsync = (...u) => new Promise((g, f) => {
            i(() => {
              r(...u).then(g).catch(f);
            });
          }), s.onWatcherCleanup(() => {
            i == null ? void 0 : i.cancel(), t.runAsync = r;
          });
        }), { onCancel: () => {
          i == null ? void 0 : i.cancel();
        } };
      }), rt = [z, Q, X, G, U, k, tt, nt, $];
      function st(t, e, n) {
        return N(t, e || {}, [...n || [], ...rt]);
      }
      b.clearCache = F, b.definePlugin = v, b.useRequest = st, Object.defineProperty(b, Symbol.toStringTag, { value: "Module" });
    });
  }
});
export default require_vue3_request_umd();
//# sourceMappingURL=vue3-request.js.map
