import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-7M3ZLALO.js";
import {
  __commonJS,
  __publicField,
  __toCommonJS
} from "./chunk-BYYN2XO5.js";

// ../../node_modules/.pnpm/vue3-request@1.0.28_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js
var require_vue3_request_umd = __commonJS({
  "../../node_modules/.pnpm/vue3-request@1.0.28_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js"(exports, module) {
    (function(w, i) {
      typeof exports == "object" && typeof module < "u" ? i(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], i) : (w = typeof globalThis < "u" ? globalThis : w || self, i(w.Vue3Request = {}, w.Vue));
    })(exports, function(w, i) {
      "use strict";
      const p = (e) => e, P = (e) => e == null, C = typeof window > "u";
      function q(e) {
        return P(e) ? e : typeof e == "number" && !isNaN(e);
      }
      function b(e, t) {
        return q(e) === void 0 ? { is: false, value: 0 } : q(e) ? t && e === -1 ? { is: true, value: -1 } : { is: true, value: e === 0 || e && e < 0 ? 0 : e } : { is: false, value: 0 };
      }
      const O = (e, t) => {
        let n = t;
        for (let s = e.length; s-- > 0; ) {
          const r = e[s];
          n = r(n);
        }
        return n == null ? void 0 : n();
      }, T = () => new Promise(() => {
      }), V = /* @__PURE__ */ new Map(), j = (e, t, { data: n, params: s, time: r }) => {
        let a;
        const o = B(e), { is: l, value: c } = b(t, true);
        l && ((o == null ? void 0 : o.timer) && clearTimeout(o.timer), c !== -1 && (a = setTimeout(() => {
          F(e);
        }, c)), V.set(e, { data: n, params: s, time: r, timer: a }));
      }, B = (e) => V.get(e), F = (e) => {
        e && typeof e == "string" ? V.delete(e) : V.clear();
      };
      class N {
        constructor(t, n) {
          __publicField(this, "currentRequestId", 0);
          __publicField(this, "pluginImpls", []);
          __publicField(this, "state");
          __publicField(this, "abort", () => {
          });
          __publicField(this, "setState", (t) => {
            if (Object.assign(this.state, t), t.data && typeof t.data == "object" && !P(t.data)) {
              const n = this.options.resKey || "data";
              Reflect.has(t.data, n) && (this.state.res = t.data[n]);
            }
          });
          __publicField(this, "executePlugin", (t, ...n) => {
            if (t === "onRequest") return { servicePromise: O(this.pluginImpls.map((r) => r.onRequest).filter(Boolean), n[0]) };
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
            this.executePlugin("onFinally", this.state.params), this.loading(false), (_b = (_a = this.options).onFinally) == null ? void 0 : _b.call(_a, this.state.params);
          });
          __publicField(this, "runAsync", async (...t) => {
            var _a, _b, _c, _d, _e, _f;
            const n = ++this.currentRequestId, { isReturn: s, isReady: r, ...a } = this.executePlugin("onBefore", t);
            if (!r) return T();
            if (this.setState({ params: t, ...a }), this.loading(true), s) return this.loading(false), a.data;
            (_b = (_a = this.options).onBefore) == null ? void 0 : _b.call(_a, t);
            try {
              const o = () => this.service(...t);
              let { servicePromise: l } = this.executePlugin("onRequest", o);
              l || (l = o());
              const c = await l;
              return n !== this.currentRequestId ? T() : (this.setState({ data: c, error: void 0 }), this.executePlugin("onSuccess", t), (_d = (_c = this.options).onSuccess) == null ? void 0 : _d.call(_c, t), this.onFinished(), this.state.data);
            } catch (o) {
              if (n !== this.currentRequestId) return T();
              throw this.setState({ data: void 0, res: void 0, error: o }), this.executePlugin("onError", t), (_f = (_e = this.options).onError) == null ? void 0 : _f.call(_e, t), this.onFinished(), this.state.error;
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
          __publicField(this, "cancel", () => {
            this.executePlugin("onCancel"), this.currentRequestId++, this.loading(false);
          });
          this.service = t, this.options = n, this.state = i.reactive({ data: void 0, res: void 0, error: void 0, params: (n == null ? void 0 : n.defaultParams) || [], loading: false, isFinished: false, isAborted: false, signal: new AbortController().signal });
        }
      }
      function U(e, t, n) {
        const s = { manual: false, ...t }, r = new N(e, s);
        r.pluginImpls = n.map((h) => h(r, s)), i.onMounted(() => {
          if (!s.manual) {
            const h = r.state.params;
            r.run(...h);
          }
        }), i.onUnmounted(r.cancel);
        const { run: a, cancel: o, refresh: l, runAsync: c, refreshAsync: g, abort: u } = r;
        return { ...i.toRefs(r.state), run: a, cancel: o, refresh: l, runAsync: c, abort: u, refreshAsync: g, clearCache: F };
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
        R.has(e) && ((_a = R.get(e)) == null ? void 0 : _a.forEach((a) => a({ data: t, params: n, time: s })));
      }, L = (e, t) => {
        var _a;
        return R.has(e) ? (_a = R.get(e)) == null ? void 0 : _a.add(t) : R.set(e, /* @__PURE__ */ new Set()), () => {
          const n = R.get(e);
          n == null ? void 0 : n.delete(t), (n == null ? void 0 : n.size) === 0 && R.delete(e);
        };
      }, S = /* @__PURE__ */ new Map(), D = (e, t) => {
        S.set(e, t), t.then(() => {
        }).catch(() => {
        }).finally(() => {
          $(e);
        });
      }, H = (e) => S.get(e), $ = (e) => {
        e && typeof e == "string" ? S.delete(e) : S.clear();
      }, z = p((e, { cacheKey: t, cacheTime: n = 3e5, staleTime: s = 0, setCache: r, getCache: a }) => {
        const o = i.ref(null);
        let l = null;
        const { is: c, value: g } = b(s, true);
        if (!c) return {};
        const u = typeof t == "function" ? t : () => t, h = (d, f) => {
          r ? r(d, f) : j(d, n, f), _(d, f);
        }, v = (d) => a ? a(d) : B(d);
        function y() {
          const d = u();
          if (!d) return;
          const f = v(d);
          f && Reflect.has(f, "data") && e.setState({ data: f.data, params: f.params }), o.value = L(d, (m) => {
            e.setState({ data: m.data });
          });
        }
        return y(), i.onUnmounted(() => {
          var _a;
          (_a = o.value) == null ? void 0 : _a.call(o);
        }), { onBefore: (d) => {
          const f = u(d);
          if (!f) return null;
          const m = v(f);
          return !m || !Reflect.has(m, "data") ? {} : g === -1 || Date.now() - m.time < g ? { data: m.data, error: void 0, isReturn: true } : { data: m.data, error: void 0 };
        }, onRequest: (d) => {
          const f = u(e.state.params);
          if (!f) return d;
          let m = H(f);
          return m && m !== l ? () => m : (m = d(), l = m, D(f, m), () => m);
        }, onSuccess: (d) => {
          var _a;
          const f = u(d);
          f && ((_a = o.value) == null ? void 0 : _a.call(o), h(f, { data: e.state.data, params: d, time: Date.now() }), o.value = L(f, (m) => {
            e.setState({ data: m.data });
          }));
        } };
      }), J = p((e, { errorRetryCount: t = 0, errorRetryInterval: n }) => {
        const s = i.ref(), r = i.ref(0), a = i.ref(false), o = i.computed(() => 1e3 * Math.pow(2, r.value)), l = () => {
          let u = null;
          r.value++;
          const { value: h } = b(i.toValue(t), true), v = h === -1, y = r.value <= h;
          if (v || y) {
            let { is: d, value: f } = b(i.toValue(n));
            d || (f = i.toValue(Math.min(o.value, 3e4))), u = setTimeout(() => {
              a.value = true, e.refresh();
            }, f);
          }
          return () => {
            u && clearTimeout(u);
          };
        }, c = () => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s);
        }, { is: g } = b(i.toValue(t), true);
        return g ? { onBefore: () => {
          a.value || (r.value = 0), a.value = false, c();
        }, onSuccess: () => {
          r.value = 0;
        }, onError: () => {
          s.value = l();
        }, onCancel: () => {
          r.value = 0, c();
        } } : {};
      }), A = () => {
        var _a;
        return C || P((_a = window.document) == null ? void 0 : _a.visibilityState) ? true : document.visibilityState === "visible";
      }, E = /* @__PURE__ */ new Set(), Q = (e) => (E.add(e), () => {
        E.delete(e);
      }), X = () => {
        A() && E.forEach((e) => {
          e();
        });
      };
      !C && (window == null ? void 0 : window.addEventListener) && window.addEventListener("visibilitychange", X, false);
      const Y = p((e, { pollingInterval: t, pollingWhenHidden: n = true, errorRetryCount: s }) => {
        const r = i.ref(null), a = i.ref(), o = () => {
          let l;
          const { value: c } = b(i.toValue(s), true);
          if (e.state.error && c !== 0) return;
          const { is: g, value: u } = b(i.toValue(t));
          return g ? (l = setTimeout(() => {
            !i.toValue(n) && !A() ? r.value = Q(e.refresh) : e.refresh();
          }, u), () => {
            var _a;
            l && clearTimeout(l), (_a = r.value) == null ? void 0 : _a.call(r);
          }) : void 0;
        };
        return i.watch([() => i.toValue(t), () => i.toValue(n)], () => {
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
      }), Z = p((e, { manual: t, refreshDeps: n, refreshDepsAction: s }) => {
        if (P(n) || typeof n != "object" && typeof n != "function") return {};
        const r = i.watch(n, () => {
          t || (s ? s() : e.refresh());
        }, { deep: true });
        return { onCancel: () => {
          r();
        } };
      }), G = () => {
        var _a;
        return (!C && ((_a = window.navigator) == null ? void 0 : _a.onLine)) ?? true;
      }, x = /* @__PURE__ */ new Set(), I = (e) => (x.add(e), () => {
        x.delete(e);
      }), M = () => {
        !A() || !G() || x.forEach((e) => {
          e();
        });
      };
      !C && (window == null ? void 0 : window.addEventListener) && (window.addEventListener("visibilitychange", M, false), window.addEventListener("focus", M, false));
      const k = p((e, { refocusTimespan: t = 5e3, refreshOnWindowFocus: n = false }) => {
        const s = i.ref(), { is: r } = b(i.toValue(t));
        if (!r || P(i.toValue(n)) || typeof i.toValue(n) != "boolean") return {};
        const a = (o, l) => {
          let c = false;
          return () => {
            c || (c = true, o(), setTimeout(() => {
              c = false;
            }, l));
          };
        };
        return i.watchEffect(() => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s), i.toValue(n) && (s.value = I(a(e.refresh, i.toValue(t))));
        }), i.onUnmounted(() => {
          var _a;
          (_a = s.value) == null ? void 0 : _a.call(s);
        }), {};
      }), K = p((e, { manual: t, ready: n = true, defaultParams: s = [] }) => {
        const r = i.watch(() => i.toValue(n), (a) => {
          !t && a && e.run(...s);
        }, { flush: "sync" });
        return { onBefore: () => ({ isReady: i.toValue(n) }), onCancel: () => {
          r();
        } };
      });
      function ee(e, t, n) {
        var s = null, r = null, a = typeof n == "boolean" ? { leading: n, trailing: !n } : Object.assign({ leading: false, trailing: true }, n), o = false, l = null, c = a.leading, g = a.trailing, u = function() {
          s = null, r = null;
        }, h = function() {
          o = true, e.apply(r, s), u();
        }, v = function() {
          if (c === true && (l = null), o) {
            u();
            return;
          }
          if (g === true) {
            h();
            return;
          }
          u();
        }, y = function() {
          var f = l !== null;
          return f && clearTimeout(l), u(), l = null, o = false, f;
        }, d = function() {
          o = false, s = arguments, r = this, l === null ? c === true && h() : clearTimeout(l), l = setTimeout(v, t);
        };
        return d.cancel = y, d;
      }
      const te = p((e, { debounceWait: t, debounceOptions: n, manual: s }) => {
        const r = i.ref(false);
        let a = null;
        const o = e.runAsync;
        return s || (r.value = true), i.watchEffect(() => {
          const { is: l, value: c } = b(i.toValue(t));
          if (!l) return;
          const g = i.toValue(n);
          a = ee((u) => u(), c, g), e.runAsync = (...u) => new Promise((h, v) => {
            r.value ? (r.value = false, o(...u).then(h).catch(v)) : a(() => {
              o(...u).then(h).catch(v);
            });
          }), i.onWatcherCleanup(() => {
            a == null ? void 0 : a.cancel(), e.runAsync = o;
          });
        }), { onCancel: () => {
          a == null ? void 0 : a.cancel();
        } };
      });
      function ne(e, t, n) {
        var s = null, r = null, a = false, o = null, l = Object.assign({ leading: true, trailing: true }, n), c = l.leading, g = l.trailing, u = function() {
          s = null, r = null;
        }, h = function() {
          a = true, e.apply(r, s), o = setTimeout(v, t), u();
        }, v = function() {
          if (o = null, a) {
            u();
            return;
          }
          if (g === true) {
            h();
            return;
          }
          u();
        }, y = function() {
          var f = o !== null;
          return f && clearTimeout(o), u(), o = null, a = false, f;
        }, d = function() {
          if (s = arguments, r = this, a = false, o === null && c === true) {
            h();
            return;
          }
          g === true && (o = setTimeout(v, t));
        };
        return d.cancel = y, d;
      }
      const re = p((e, { throttleWait: t, throttleOptions: n }) => {
        let s = null;
        const r = e.runAsync;
        return i.watchEffect(() => {
          const { is: a, value: o } = b(i.toValue(t));
          if (!a) return;
          const l = i.toValue(n);
          s = ne((c) => c(), o, l), e.runAsync = (...c) => new Promise((g, u) => {
            s(() => {
              r(...c).then(g).catch(u);
            });
          }), i.onWatcherCleanup(() => {
            s == null ? void 0 : s.cancel(), e.runAsync = r;
          });
        }), { onCancel: () => {
          s == null ? void 0 : s.cancel();
        } };
      }), ie = [J, Y, Z, k, W, K, te, re, z];
      function se(e, t, n) {
        return U(e, t || {}, [...n || [], ...ie]);
      }
      w.clearCache = F, w.definePlugin = p, w.useRequest = se, Object.defineProperty(w, Symbol.toStringTag, { value: "Module" });
    });
  }
});
export default require_vue3_request_umd();
//# sourceMappingURL=vue3-request.js.map
