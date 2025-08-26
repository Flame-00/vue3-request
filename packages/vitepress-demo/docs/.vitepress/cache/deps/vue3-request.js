import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-7M3ZLALO.js";
import {
  __commonJS,
  __publicField,
  __toCommonJS
} from "./chunk-BYYN2XO5.js";

// ../../node_modules/.pnpm/vue3-request@1.0.23_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js
var require_vue3_request_umd = __commonJS({
  "../../node_modules/.pnpm/vue3-request@1.0.23_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js"(exports, module) {
    (function(w, i) {
      typeof exports == "object" && typeof module < "u" ? i(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], i) : (w = typeof globalThis < "u" ? globalThis : w || self, i(w.Vue3Request = {}, w.Vue));
    })(exports, function(w, i) {
      "use strict";
      const v = (t) => t, P = (t) => t == null, C = typeof window > "u";
      function q(t) {
        return P(t) ? t : typeof t == "number" && !isNaN(t);
      }
      function p(t, e) {
        return q(t) === void 0 ? { is: false, value: 0 } : q(t) ? e && t === -1 ? { is: true, value: -1 } : { is: true, value: t === 0 || t && t < 0 ? 0 : t } : { is: false, value: 0 };
      }
      const L = (t, e) => {
        let n = e;
        for (let s = t.length; s-- > 0; ) {
          const r = t[s];
          n = r(n);
        }
        return n == null ? void 0 : n();
      }, y = () => new Promise(() => {
      }), O = (t) => t instanceof Function, S = /* @__PURE__ */ new Map(), j = (t, e, { data: n, params: s, time: r }) => {
        let a;
        const o = x(t), { is: l, value: u } = p(e, true);
        l && ((o == null ? void 0 : o.timer) && clearTimeout(o.timer), u !== -1 && (a = setTimeout(() => {
          T(t);
        }, u)), S.set(t, { data: n, params: s, time: r, timer: a }));
      }, x = (t) => S.get(t), T = (t) => {
        t && typeof t == "string" ? S.delete(t) : S.clear();
      };
      class N {
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
            if (e === "onRequest") return { servicePromise: L(this.pluginImpls.map((r) => r.onRequest).filter(Boolean), n[0]) };
            {
              const s = this.pluginImpls.map((r) => {
                var _a;
                return (_a = r[e]) == null ? void 0 : _a.call(r, ...n);
              }).filter(Boolean);
              return Object.assign({}, ...s);
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
            const n = ++this.currentRequestId, { isReturn: s, isReady: r, ...a } = this.executePlugin("onBefore", e);
            if (!r) return y();
            if (this.setState({ params: e }), this.loading(true), s) return this.loading(a.loading || false), a.data;
            (_b = (_a = this.options).onBefore) == null ? void 0 : _b.call(_a, e);
            try {
              const o = () => this.service(...e);
              let { servicePromise: l } = this.executePlugin("onRequest", o);
              l || (l = o());
              const u = await l;
              return n !== this.currentRequestId ? y() : (this.setState({ data: u, error: void 0 }), this.executePlugin("onSuccess", u, e), (_d = (_c = this.options).onSuccess) == null ? void 0 : _d.call(_c, u, e), this.onFinished(), u);
            } catch (o) {
              if (n !== this.currentRequestId) return y();
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
          this.service = e, this.options = n, this.state = i.reactive({ data: void 0, error: void 0, params: (n == null ? void 0 : n.defaultParams) || [], loading: false, isFinished: false, isAborted: false, signal: new AbortController().signal });
        }
      }
      function U(t, e, n) {
        const s = { manual: false, ...e }, r = new N(t, s);
        r.pluginImpls = n.map((m) => m(r, s)), i.onMounted(() => {
          if (!s.manual) {
            const m = r.state.params;
            r.run(...m);
          }
        }), i.onUnmounted(r.cancel);
        const { run: a, cancel: o, refresh: l, runAsync: u, refreshAsync: h, abort: f, mutate: g } = r;
        return { ...i.toRefs(r.state), run: a, cancel: o, refresh: l, runAsync: u, mutate: g, abort: f, refreshAsync: h, clearCache: T };
      }
      const D = v((t, { abortPrevious: e = true }) => {
        let n = null;
        const s = () => {
          n = new AbortController(), t.setState({ signal: n.signal, isAborted: n.signal.aborted });
        };
        return t.abort = () => {
          n && !n.signal.aborted && !t.state.isFinished && (n.abort(), t.setState({ isAborted: n.signal.aborted }));
        }, { onBefore: () => {
          typeof e == "boolean" && e && t.abort(), s();
        }, onRequest: (r) => () => r(), onCancel: () => {
          t.abort(), n = null;
        } };
      }), R = /* @__PURE__ */ new Map(), W = (t, { data: e, params: n, time: s }) => {
        var _a;
        R.has(t) && ((_a = R.get(t)) == null ? void 0 : _a.forEach((a) => a({ data: e, params: n, time: s })));
      }, B = (t, e) => {
        var _a;
        return R.has(t) ? (_a = R.get(t)) == null ? void 0 : _a.add(e) : R.set(t, /* @__PURE__ */ new Set()), () => {
          const n = R.get(t);
          n == null ? void 0 : n.delete(e), (n == null ? void 0 : n.size) === 0 && R.delete(t);
        };
      }, V = /* @__PURE__ */ new Map(), H = (t, e) => {
        V.set(t, e), e.then((n) => {
        }).catch(() => {
        }).finally(() => {
          $(t);
        });
      }, _ = (t) => V.get(t), $ = (t) => {
        t && typeof t == "string" ? V.delete(t) : V.clear();
      }, z = v((t, { cacheKey: e, cacheTime: n = 3e5, staleTime: s = 0, setCache: r, getCache: a }) => {
        const o = i.ref(null);
        let l = null;
        const { is: u, value: h } = p(s, true);
        if (!u) return {};
        const f = (c, d) => {
          r ? r(c, d) : j(c, n, d), W(c, d);
        }, g = (c) => a ? a(c) : x(c);
        function m() {
          if (!e) return;
          const c = g(e);
          c && Reflect.has(c, "data") && t.setState({ data: c.data, params: c.params }), o.value = B(e, (d) => {
            t.setState({ data: d.data });
          });
        }
        return m(), i.onUnmounted(() => {
          var _a;
          (_a = o.value) == null ? void 0 : _a.call(o);
        }), { onBefore: () => {
          if (!e) return null;
          const c = g(e);
          return !c || !Reflect.has(c, "data") ? {} : h === -1 || Date.now() - c.time < h ? { loading: false, data: c.data, error: void 0, isReturn: true } : { data: c.data, error: void 0 };
        }, onRequest: (c) => {
          if (!e) return c;
          let d = _(e);
          return d && d !== l ? () => d : (d = c(), l = d, H(e, d), () => d);
        }, onSuccess: (c, d) => {
          var _a;
          if (!e) return;
          const b = { data: c, params: d, time: Date.now() };
          (_a = o.value) == null ? void 0 : _a.call(o), f(e, b), o.value = B(e, (at) => {
            t.setState({ data: at.data });
          });
        } };
      }), I = v((t, { errorRetryCount: e = 0, errorRetryInterval: n }) => {
        const s = i.ref(), r = i.ref(0), a = i.ref(false), o = i.computed(() => 1e3 * Math.pow(2, r.value)), l = () => {
          let f = null;
          r.value++;
          const { value: g } = p(i.toValue(e), true), m = g === -1, c = r.value <= g;
          if (m || c) {
            let { is: d, value: b } = p(i.toValue(n));
            d || (b = i.toValue(Math.min(o.value, 3e4))), f = setTimeout(() => {
              a.value = true, t.refresh();
            }, b);
          }
          return () => {
            f && clearTimeout(f);
          };
        }, u = () => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s);
        }, { is: h } = p(i.toValue(e), true);
        return h ? { onBefore: () => {
          a.value || (r.value = 0), a.value = false, u();
        }, onSuccess: () => {
          r.value = 0;
        }, onError: () => {
          s.value = l();
        }, onCancel: () => {
          r.value = 0, u();
        } } : {};
      }), F = () => {
        var _a;
        return C || P((_a = window.document) == null ? void 0 : _a.visibilityState) ? true : document.visibilityState === "visible";
      }, A = /* @__PURE__ */ new Set(), J = (t) => (A.add(t), () => {
        A.delete(t);
      }), Q = () => {
        F() && A.forEach((t) => {
          t();
        });
      };
      !C && (window == null ? void 0 : window.addEventListener) && window.addEventListener("visibilitychange", Q, false);
      const X = v((t, { pollingInterval: e, pollingWhenHidden: n = true, errorRetryCount: s }) => {
        const r = i.ref(null), a = i.ref(), o = () => {
          let l;
          const { value: u } = p(i.toValue(s), true);
          if (t.state.error && u !== 0) return;
          const { is: h, value: f } = p(i.toValue(e));
          return h ? (l = setTimeout(() => {
            !i.toValue(n) && !F() ? r.value = J(t.refresh) : t.refresh();
          }, f), () => {
            var _a;
            l && clearTimeout(l), (_a = r.value) == null ? void 0 : _a.call(r);
          }) : void 0;
        };
        return i.watch([() => i.toValue(e), () => i.toValue(n)], () => {
          var _a;
          (_a = a.value) == null ? void 0 : _a.call(a), a.value = o();
        }), i.onUnmounted(() => {
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
      }), Y = v((t, { manual: e, refreshDeps: n, refreshDepsAction: s }) => {
        if (P(n) || typeof n != "object" && typeof n != "function") return {};
        const r = i.watch(n, () => {
          e || (s ? s() : t.refresh());
        }, { deep: true });
        return { onCancel: () => {
          r();
        } };
      }), Z = () => {
        var _a;
        return (!C && ((_a = window.navigator) == null ? void 0 : _a.onLine)) ?? true;
      }, E = /* @__PURE__ */ new Set(), G = (t) => (E.add(t), () => {
        E.delete(t);
      }), M = () => {
        !F() || !Z() || E.forEach((t) => {
          t();
        });
      };
      !C && (window == null ? void 0 : window.addEventListener) && (window.addEventListener("visibilitychange", M, false), window.addEventListener("focus", M, false));
      const k = v((t, { refocusTimespan: e = 5e3, refreshOnWindowFocus: n = false }) => {
        const s = i.ref(), { is: r } = p(i.toValue(e));
        if (!r || P(i.toValue(n)) || typeof i.toValue(n) != "boolean") return {};
        const a = (o, l) => {
          let u = false;
          return () => {
            u || (u = true, o(), setTimeout(() => {
              u = false;
            }, l));
          };
        };
        return i.watchEffect(() => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s), i.toValue(n) && (s.value = G(a(t.refresh, i.toValue(e))));
        }), i.onUnmounted(() => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s);
        }), {};
      }), K = v((t, { manual: e, ready: n = true, defaultParams: s = [] }) => {
        const r = i.watch(() => i.toValue(n), (a) => {
          !e && a && t.run(...s);
        }, { flush: "sync" });
        return { onBefore: () => ({ isReady: i.toValue(n) }), onCancel: () => {
          r();
        } };
      });
      function tt(t, e, n) {
        var s = null, r = null, a = typeof n == "boolean" ? { leading: n, trailing: !n } : Object.assign({ leading: false, trailing: true }, n), o = false, l = null, u = a.leading, h = a.trailing, f = function() {
          s = null, r = null;
        }, g = function() {
          o = true, t.apply(r, s), f();
        }, m = function() {
          if (u === true && (l = null), o) {
            f();
            return;
          }
          if (h === true) {
            g();
            return;
          }
          f();
        }, c = function() {
          var b = l !== null;
          return b && clearTimeout(l), f(), l = null, o = false, b;
        }, d = function() {
          o = false, s = arguments, r = this, l === null ? u === true && g() : clearTimeout(l), l = setTimeout(m, e);
        };
        return d.cancel = c, d;
      }
      const et = v((t, { debounceWait: e, debounceOptions: n, manual: s }) => {
        const r = i.ref(false);
        let a = null;
        const o = t.runAsync;
        return s || (r.value = true), i.watchEffect(() => {
          const { is: l, value: u } = p(i.toValue(e));
          if (!l) return;
          const h = i.toValue(n);
          a = tt((f) => f(), u, h), t.runAsync = (...f) => new Promise((g, m) => {
            r.value ? (r.value = false, o(...f).then(g).catch(m)) : a(() => {
              o(...f).then(g).catch(m);
            });
          }), i.onWatcherCleanup(() => {
            a == null ? void 0 : a.cancel(), t.runAsync = o;
          });
        }), { onCancel: () => {
          a == null ? void 0 : a.cancel();
        } };
      });
      function nt(t, e, n) {
        var s = null, r = null, a = false, o = null, l = Object.assign({ leading: true, trailing: true }, n), u = l.leading, h = l.trailing, f = function() {
          s = null, r = null;
        }, g = function() {
          a = true, t.apply(r, s), o = setTimeout(m, e), f();
        }, m = function() {
          if (o = null, a) {
            f();
            return;
          }
          if (h === true) {
            g();
            return;
          }
          f();
        }, c = function() {
          var b = o !== null;
          return b && clearTimeout(o), f(), o = null, a = false, b;
        }, d = function() {
          if (s = arguments, r = this, a = false, o === null && u === true) {
            g();
            return;
          }
          h === true && (o = setTimeout(m, e));
        };
        return d.cancel = c, d;
      }
      const rt = v((t, { throttleWait: e, throttleOptions: n }) => {
        let s = null;
        const r = t.runAsync;
        return i.watchEffect(() => {
          const { is: a, value: o } = p(i.toValue(e));
          if (!a) return;
          const l = i.toValue(n);
          s = nt((u) => u(), o, l), t.runAsync = (...u) => new Promise((h, f) => {
            s(() => {
              r(...u).then(h).catch(f);
            });
          }), i.onWatcherCleanup(() => {
            s == null ? void 0 : s.cancel(), t.runAsync = r;
          });
        }), { onCancel: () => {
          s == null ? void 0 : s.cancel();
        } };
      }), it = [I, X, Y, k, D, K, et, rt, z];
      function st(t, e, n) {
        return U(t, e || {}, [...n || [], ...it]);
      }
      w.clearCache = T, w.definePlugin = v, w.useRequest = st, Object.defineProperty(w, Symbol.toStringTag, { value: "Module" });
    });
  }
});
export default require_vue3_request_umd();
//# sourceMappingURL=vue3-request.js.map
