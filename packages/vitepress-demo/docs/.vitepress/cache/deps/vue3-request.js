import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-7M3ZLALO.js";
import {
  __commonJS,
  __publicField,
  __toCommonJS
} from "./chunk-BYYN2XO5.js";

// ../../node_modules/.pnpm/vue3-request@1.0.24_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js
var require_vue3_request_umd = __commonJS({
  "../../node_modules/.pnpm/vue3-request@1.0.24_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js"(exports, module) {
    (function(w, i) {
      typeof exports == "object" && typeof module < "u" ? i(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], i) : (w = typeof globalThis < "u" ? globalThis : w || self, i(w.Vue3Request = {}, w.Vue));
    })(exports, function(w, i) {
      "use strict";
      const p = (e) => e, P = (e) => e == null, C = typeof window > "u";
      function B(e) {
        return P(e) ? e : typeof e == "number" && !isNaN(e);
      }
      function b(e, t) {
        return B(e) === void 0 ? { is: false, value: 0 } : B(e) ? t && e === -1 ? { is: true, value: -1 } : { is: true, value: e === 0 || e && e < 0 ? 0 : e } : { is: false, value: 0 };
      }
      const q = (e, t) => {
        let n = t;
        for (let s = e.length; s-- > 0; ) {
          const r = e[s];
          n = r(n);
        }
        return n == null ? void 0 : n();
      }, T = () => new Promise(() => {
      }), j = (e) => e instanceof Function, S = /* @__PURE__ */ new Map(), N = (e, t, { data: n, params: s, time: r }) => {
        let o;
        const a = L(e), { is: l, value: u } = b(t, true);
        l && ((a == null ? void 0 : a.timer) && clearTimeout(a.timer), u !== -1 && (o = setTimeout(() => {
          F(e);
        }, u)), S.set(e, { data: n, params: s, time: r, timer: o }));
      }, L = (e) => S.get(e), F = (e) => {
        e && typeof e == "string" ? S.delete(e) : S.clear();
      };
      class U {
        constructor(t, n) {
          __publicField(this, "currentRequestId", 0);
          __publicField(this, "pluginImpls", []);
          __publicField(this, "state");
          __publicField(this, "abort", () => {
          });
          __publicField(this, "setState", (t) => {
            Object.assign(this.state, t);
          });
          __publicField(this, "executePlugin", (t, ...n) => {
            if (t === "onRequest") return { servicePromise: q(this.pluginImpls.map((r) => r.onRequest).filter(Boolean), n[0]) };
            {
              const s = this.pluginImpls.map((r) => {
                var _a;
                return (_a = r[t]) == null ? void 0 : _a.call(r, ...n);
              }).filter(Boolean);
              return Object.assign({}, ...s);
            }
          });
          __publicField(this, "loading", (t) => {
            this.setState({ loading: t, isFinished: !t });
          });
          __publicField(this, "onFinished", () => {
            var _a, _b;
            this.executePlugin("onFinally", this.state.params, this.state.data, this.state.error), this.loading(false), (_b = (_a = this.options).onFinally) == null ? void 0 : _b.call(_a, this.state.params, this.state.data, this.state.error);
          });
          __publicField(this, "runAsync", async (...t) => {
            var _a, _b, _c, _d, _e, _f;
            const n = ++this.currentRequestId, { isReturn: s, isReady: r, ...o } = this.executePlugin("onBefore", t);
            if (!r) return T();
            if (this.setState({ params: t, ...o }), this.loading(true), s) return this.loading(false), o.data;
            (_b = (_a = this.options).onBefore) == null ? void 0 : _b.call(_a, t);
            try {
              const a = () => this.service(...t);
              let { servicePromise: l } = this.executePlugin("onRequest", a);
              l || (l = a());
              const u = await l;
              return n !== this.currentRequestId ? T() : (this.setState({ data: u, error: void 0 }), this.executePlugin("onSuccess", u, t), (_d = (_c = this.options).onSuccess) == null ? void 0 : _d.call(_c, u, t), this.onFinished(), u);
            } catch (a) {
              if (n !== this.currentRequestId) return T();
              const l = a;
              throw this.setState({ data: void 0, error: l }), this.executePlugin("onError", l, t), (_f = (_e = this.options).onError) == null ? void 0 : _f.call(_e, l, t), this.onFinished(), l;
            }
          });
          __publicField(this, "run", (...t) => {
            this.runAsync(...t).catch((n) => {
              this.options.onError;
            });
          });
          __publicField(this, "refresh", () => {
            this.run(...this.state.params);
          });
          __publicField(this, "refreshAsync", async () => await this.runAsync(...this.state.params));
          __publicField(this, "mutate", (t) => {
            j(t) ? t(this.state.data) : this.setState({ data: t }), this.executePlugin("onMutate", this.state.data);
          });
          __publicField(this, "cancel", () => {
            this.executePlugin("onCancel"), this.currentRequestId++, this.loading(false);
          });
          this.service = t, this.options = n, this.state = i.reactive({ data: void 0, error: void 0, params: (n == null ? void 0 : n.defaultParams) || [], loading: false, isFinished: false, isAborted: false, signal: new AbortController().signal });
        }
      }
      function D(e, t, n) {
        const s = { manual: false, ...t }, r = new U(e, s);
        r.pluginImpls = n.map((v) => v(r, s)), i.onMounted(() => {
          if (!s.manual) {
            const v = r.state.params;
            r.run(...v);
          }
        }), i.onUnmounted(r.cancel);
        const { run: o, cancel: a, refresh: l, runAsync: u, refreshAsync: g, abort: f, mutate: m } = r;
        return { ...i.toRefs(r.state), run: o, cancel: a, refresh: l, runAsync: u, mutate: m, abort: f, refreshAsync: g, clearCache: F };
      }
      const W = p((e, { abortPrevious: t = true }) => {
        let n = null;
        const s = () => {
          n = new AbortController(), e.setState({ signal: n.signal, isAborted: n.signal.aborted });
        };
        return e.abort = () => {
          n && !n.signal.aborted && !e.state.isFinished && (n.abort(), e.setState({ isAborted: n.signal.aborted }));
        }, { onBefore: () => {
          typeof t == "boolean" && t && e.abort(), s();
        }, onRequest: (r) => () => r(), onCancel: () => {
          e.abort(), n = null;
        } };
      }), R = /* @__PURE__ */ new Map(), _ = (e, { data: t, params: n, time: s }) => {
        var _a;
        R.has(e) && ((_a = R.get(e)) == null ? void 0 : _a.forEach((o) => o({ data: t, params: n, time: s })));
      }, A = (e, t) => {
        var _a;
        return R.has(e) ? (_a = R.get(e)) == null ? void 0 : _a.add(t) : R.set(e, /* @__PURE__ */ new Set()), () => {
          const n = R.get(e);
          n == null ? void 0 : n.delete(t), (n == null ? void 0 : n.size) === 0 && R.delete(e);
        };
      }, V = /* @__PURE__ */ new Map(), H = (e, t) => {
        V.set(e, t), t.then(() => {
        }).catch(() => {
        }).finally(() => {
          z(e);
        });
      }, $ = (e) => V.get(e), z = (e) => {
        e && typeof e == "string" ? V.delete(e) : V.clear();
      }, J = p((e, { cacheKey: t, cacheTime: n = 3e5, staleTime: s = 0, setCache: r, getCache: o }) => {
        const a = i.ref(null);
        let l = null;
        const { is: u, value: g } = b(s, true);
        if (!u) return {};
        const f = typeof t == "function" ? t : () => t, m = (d, c) => {
          r ? r(d, c) : N(d, n, c), _(d, c);
        }, v = (d) => o ? o(d) : L(d);
        function y() {
          const d = f();
          if (!d) return;
          const c = v(d);
          c && Reflect.has(c, "data") && e.setState({ data: c.data, params: c.params }), a.value = A(d, (h) => {
            e.setState({ data: h.data });
          });
        }
        return y(), i.onUnmounted(() => {
          var _a;
          (_a = a.value) == null ? void 0 : _a.call(a);
        }), { onBefore: (d) => {
          const c = f(d);
          if (!c) return null;
          const h = v(c);
          return !h || !Reflect.has(h, "data") ? {} : g === -1 || Date.now() - h.time < g ? { data: h.data, error: void 0, isReturn: true } : { data: h.data, error: void 0 };
        }, onRequest: (d) => {
          const c = f(e.state.params);
          if (!c) return d;
          let h = $(c);
          return h && h !== l ? () => h : (h = d(), l = h, H(c, h), () => h);
        }, onSuccess: (d, c) => {
          var _a;
          const h = f(c);
          h && ((_a = a.value) == null ? void 0 : _a.call(a), m(h, { data: d, params: c, time: Date.now() }), a.value = A(h, (oe) => {
            e.setState({ data: oe.data });
          }));
        }, onMutate(d) {
          var _a;
          const c = f(e.state.params);
          c && ((_a = a.value) == null ? void 0 : _a.call(a), m(c, { data: d, params: e.state.params, time: Date.now() }), a.value = A(c, (h) => {
            e.setState({ data: h.data });
          }));
        } };
      }), Q = p((e, { errorRetryCount: t = 0, errorRetryInterval: n }) => {
        const s = i.ref(), r = i.ref(0), o = i.ref(false), a = i.computed(() => 1e3 * Math.pow(2, r.value)), l = () => {
          let f = null;
          r.value++;
          const { value: m } = b(i.toValue(t), true), v = m === -1, y = r.value <= m;
          if (v || y) {
            let { is: d, value: c } = b(i.toValue(n));
            d || (c = i.toValue(Math.min(a.value, 3e4))), f = setTimeout(() => {
              o.value = true, e.refresh();
            }, c);
          }
          return () => {
            f && clearTimeout(f);
          };
        }, u = () => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s);
        }, { is: g } = b(i.toValue(t), true);
        return g ? { onBefore: () => {
          o.value || (r.value = 0), o.value = false, u();
        }, onSuccess: () => {
          r.value = 0;
        }, onError: () => {
          s.value = l();
        }, onCancel: () => {
          r.value = 0, u();
        } } : {};
      }), E = () => {
        var _a;
        return C || P((_a = window.document) == null ? void 0 : _a.visibilityState) ? true : document.visibilityState === "visible";
      }, x = /* @__PURE__ */ new Set(), X = (e) => (x.add(e), () => {
        x.delete(e);
      }), Y = () => {
        E() && x.forEach((e) => {
          e();
        });
      };
      !C && (window == null ? void 0 : window.addEventListener) && window.addEventListener("visibilitychange", Y, false);
      const Z = p((e, { pollingInterval: t, pollingWhenHidden: n = true, errorRetryCount: s }) => {
        const r = i.ref(null), o = i.ref(), a = () => {
          let l;
          const { value: u } = b(i.toValue(s), true);
          if (e.state.error && u !== 0) return;
          const { is: g, value: f } = b(i.toValue(t));
          return g ? (l = setTimeout(() => {
            !i.toValue(n) && !E() ? r.value = X(e.refresh) : e.refresh();
          }, f), () => {
            var _a;
            l && clearTimeout(l), (_a = r.value) == null ? void 0 : _a.call(r);
          }) : void 0;
        };
        return i.watch([() => i.toValue(t), () => i.toValue(n)], () => {
          var _a;
          (_a = o.value) == null ? void 0 : _a.call(o), o.value = a();
        }), i.onUnmounted(() => {
          var _a;
          (_a = r.value) == null ? void 0 : _a.call(r);
        }), { onBefore: () => {
          var _a;
          (_a = o.value) == null ? void 0 : _a.call(o);
        }, onCancel: () => {
          var _a;
          (_a = o.value) == null ? void 0 : _a.call(o);
        }, onFinally: () => {
          o.value = a();
        } };
      }), G = p((e, { manual: t, refreshDeps: n, refreshDepsAction: s }) => {
        if (P(n) || typeof n != "object" && typeof n != "function") return {};
        const r = i.watch(n, () => {
          t || (s ? s() : e.refresh());
        }, { deep: true });
        return { onCancel: () => {
          r();
        } };
      }), k = () => {
        var _a;
        return (!C && ((_a = window.navigator) == null ? void 0 : _a.onLine)) ?? true;
      }, M = /* @__PURE__ */ new Set(), I = (e) => (M.add(e), () => {
        M.delete(e);
      }), O = () => {
        !E() || !k() || M.forEach((e) => {
          e();
        });
      };
      !C && (window == null ? void 0 : window.addEventListener) && (window.addEventListener("visibilitychange", O, false), window.addEventListener("focus", O, false));
      const K = p((e, { refocusTimespan: t = 5e3, refreshOnWindowFocus: n = false }) => {
        const s = i.ref(), { is: r } = b(i.toValue(t));
        if (!r || P(i.toValue(n)) || typeof i.toValue(n) != "boolean") return {};
        const o = (a, l) => {
          let u = false;
          return () => {
            u || (u = true, a(), setTimeout(() => {
              u = false;
            }, l));
          };
        };
        return i.watchEffect(() => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s), i.toValue(n) && (s.value = I(o(e.refresh, i.toValue(t))));
        }), i.onUnmounted(() => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s);
        }), {};
      }), ee = p((e, { manual: t, ready: n = true, defaultParams: s = [] }) => {
        const r = i.watch(() => i.toValue(n), (o) => {
          !t && o && e.run(...s);
        }, { flush: "sync" });
        return { onBefore: () => ({ isReady: i.toValue(n) }), onCancel: () => {
          r();
        } };
      });
      function te(e, t, n) {
        var s = null, r = null, o = typeof n == "boolean" ? { leading: n, trailing: !n } : Object.assign({ leading: false, trailing: true }, n), a = false, l = null, u = o.leading, g = o.trailing, f = function() {
          s = null, r = null;
        }, m = function() {
          a = true, e.apply(r, s), f();
        }, v = function() {
          if (u === true && (l = null), a) {
            f();
            return;
          }
          if (g === true) {
            m();
            return;
          }
          f();
        }, y = function() {
          var c = l !== null;
          return c && clearTimeout(l), f(), l = null, a = false, c;
        }, d = function() {
          a = false, s = arguments, r = this, l === null ? u === true && m() : clearTimeout(l), l = setTimeout(v, t);
        };
        return d.cancel = y, d;
      }
      const ne = p((e, { debounceWait: t, debounceOptions: n, manual: s }) => {
        const r = i.ref(false);
        let o = null;
        const a = e.runAsync;
        return s || (r.value = true), i.watchEffect(() => {
          const { is: l, value: u } = b(i.toValue(t));
          if (!l) return;
          const g = i.toValue(n);
          o = te((f) => f(), u, g), e.runAsync = (...f) => new Promise((m, v) => {
            r.value ? (r.value = false, a(...f).then(m).catch(v)) : o(() => {
              a(...f).then(m).catch(v);
            });
          }), i.onWatcherCleanup(() => {
            o == null ? void 0 : o.cancel(), e.runAsync = a;
          });
        }), { onCancel: () => {
          o == null ? void 0 : o.cancel();
        } };
      });
      function re(e, t, n) {
        var s = null, r = null, o = false, a = null, l = Object.assign({ leading: true, trailing: true }, n), u = l.leading, g = l.trailing, f = function() {
          s = null, r = null;
        }, m = function() {
          o = true, e.apply(r, s), a = setTimeout(v, t), f();
        }, v = function() {
          if (a = null, o) {
            f();
            return;
          }
          if (g === true) {
            m();
            return;
          }
          f();
        }, y = function() {
          var c = a !== null;
          return c && clearTimeout(a), f(), a = null, o = false, c;
        }, d = function() {
          if (s = arguments, r = this, o = false, a === null && u === true) {
            m();
            return;
          }
          g === true && (a = setTimeout(v, t));
        };
        return d.cancel = y, d;
      }
      const ie = p((e, { throttleWait: t, throttleOptions: n }) => {
        let s = null;
        const r = e.runAsync;
        return i.watchEffect(() => {
          const { is: o, value: a } = b(i.toValue(t));
          if (!o) return;
          const l = i.toValue(n);
          s = re((u) => u(), a, l), e.runAsync = (...u) => new Promise((g, f) => {
            s(() => {
              r(...u).then(g).catch(f);
            });
          }), i.onWatcherCleanup(() => {
            s == null ? void 0 : s.cancel(), e.runAsync = r;
          });
        }), { onCancel: () => {
          s == null ? void 0 : s.cancel();
        } };
      }), se = [Q, Z, G, K, W, ee, ne, ie, J];
      function ae(e, t, n) {
        return D(e, t || {}, [...n || [], ...se]);
      }
      w.clearCache = F, w.definePlugin = p, w.useRequest = ae, Object.defineProperty(w, Symbol.toStringTag, { value: "Module" });
    });
  }
});
export default require_vue3_request_umd();
//# sourceMappingURL=vue3-request.js.map
