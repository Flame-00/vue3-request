import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-YORUFTD3.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-DZZM6G22.js";

// ../../node_modules/.pnpm/vue3-request@1.0.18_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js
var require_vue3_request_umd = __commonJS({
  "../../node_modules/.pnpm/vue3-request@1.0.18_typescript@5.8.3/node_modules/vue3-request/dist/vue3-request.umd.js"(exports, module) {
    (function(d, u) {
      typeof exports == "object" && typeof module < "u" ? u(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], u) : (d = typeof globalThis < "u" ? globalThis : d || self, u(d.Vue3Request = {}, d.Vue));
    })(exports, function(d, u) {
      "use strict";
      const C = (t) => t == null;
      function y(t) {
        return C(t) ? t : typeof t == "number" && !isNaN(t);
      }
      function R(t, e) {
        return y(t) === void 0 ? { is: false, value: 0 } : y(t) ? e && t === -1 ? { is: true, value: -1 } : { is: true, value: t === 0 || t && t < 0 ? 0 : t } : { is: false, value: 0 };
      }
      const S = (t) => new Promise((e) => setTimeout(e, t)), q = (t, e) => {
        let s = e;
        for (let n = t.length; n-- > 0; ) {
          const r = t[n];
          s = r(s);
        }
        return s == null ? void 0 : s();
      }, T = () => new Promise(() => {
      });
      class x {
        constructor(e, s) {
          this.service = e, this.options = s, this.currentRequestId = 0, this.pluginImpls = [], this.setState = (n) => {
            Object.assign(this.state, n);
          }, this.executePlugin = (n, ...r) => {
            if (n === "onRequest") return { servicePromise: q(this.pluginImpls.map((i) => i.onRequest).filter(Boolean), r[0]) };
            {
              const a = this.pluginImpls.map((i) => {
                var _a;
                return (_a = i[n]) == null ? void 0 : _a.apply(i, r);
              }).filter(Boolean);
              return Object.assign({}, ...a);
            }
          }, this.loading = (n) => {
            this.setState({ isLoading: n, isFinished: !n });
          }, this.onFinished = () => {
            var _a, _b;
            this.executePlugin("onFinally", this.state.params, this.state.data, this.state.error), this.loading(false), (_b = (_a = this.options).onFinally) == null ? void 0 : _b.call(_a, this.state.params, this.state.data, this.state.error);
          }, this.runAsync = async (...n) => {
            var _a, _b, _c, _d, _e, _f;
            const r = ++this.currentRequestId, { signal: a, isStaleTime: i, isReady: l } = this.executePlugin("onBefore", this.state.params);
            if (!l) return T();
            if (n.length && this.setState({ params: n }), this.loading(true), i) return this.loading(false), this.state.data;
            (_b = (_a = this.options).onBefore) == null ? void 0 : _b.call(_a, this.state.params);
            try {
              const h = () => this.service(a)(...this.state.params);
              let { servicePromise: f } = this.executePlugin("onRequest", h);
              f || (f = h());
              const o = await f;
              return r !== this.currentRequestId ? T() : (this.setState({ data: o }), this.executePlugin("onSuccess", o, this.state.params), (_d = (_c = this.options).onSuccess) == null ? void 0 : _d.call(_c, o, this.state.params), this.onFinished(), o);
            } catch (h) {
              if (r !== this.currentRequestId) return T();
              const f = h;
              throw this.setState({ error: f }), this.executePlugin("onError", f, this.state.params), (_f = (_e = this.options).onError) == null ? void 0 : _f.call(_e, f, this.state.params), this.onFinished(), f;
            }
          }, this.run = (...n) => {
            this.runAsync(...n).catch((r) => {
              this.options.onError;
            });
          }, this.refresh = () => {
            this.run(...this.state.params);
          }, this.refreshAsync = async () => await this.runAsync(...this.state.params), this.cancel = () => {
            this.currentRequestId = 0, this.loading(false), this.executePlugin("onCancel");
          }, this.state = u.reactive({ data: void 0, isLoading: false, isFinished: false, isAborted: false, error: void 0, params: (s == null ? void 0 : s.defaultParams) || [] });
        }
      }
      const b = /* @__PURE__ */ new Map(), O = (t, { data: e, params: s, time: n }) => {
        b.set(t, { data: e, params: s, time: n });
      }, F = (t) => b.get(t), A = (t) => {
        t ? b.delete(t) : b.clear();
      };
      function B(t, e, s) {
        const n = { manual: false, defaultParams: [], ...e }, r = new x(t, n);
        r.pluginImpls = s.map((c) => c(r, n)), n.manual || r.run(...n.defaultParams), u.onUnmounted(r.cancel);
        const { run: a, cancel: i, refresh: l, runAsync: h, refreshAsync: f, abort: o } = r;
        return { ...u.toRefs(r.state), run: a, cancel: i, refresh: l, runAsync: h, abort: o, refreshAsync: f, clearCache: A };
      }
      const I = (t) => {
        let e = null, { setState: s } = t;
        const n = () => (e = new AbortController(), s({ isAborted: e.signal.aborted }), { signal: e.signal });
        return t.abort = () => {
          e && !e.signal.aborted && !t.state.isFinished && (e.abort(), s({ isAborted: e.signal.aborted }));
        }, { onBefore: () => {
          t.abort();
          const { signal: r } = n();
          return { signal: r };
        }, onRequest: (r) => r, onCancel: () => {
          t.abort(), e = null;
        } };
      }, m = /* @__PURE__ */ new Map(), L = (t, { data: e, params: s, time: n }) => {
        var _a;
        m.has(t) && ((_a = m.get(t)) == null ? void 0 : _a.forEach((a) => a({ data: e, params: s, time: n })));
      }, E = (t, e) => {
        var _a;
        return m.has(t) ? (_a = m.get(t)) == null ? void 0 : _a.add(e) : m.set(t, /* @__PURE__ */ new Set()), () => {
          const s = m.get(t);
          s == null ? void 0 : s.delete(e), (s == null ? void 0 : s.size) === 0 && m.delete(t);
        };
      }, P = /* @__PURE__ */ new Map(), M = (t, e) => {
        P.set(t, e), e.then(() => {
        }).catch(() => {
        }).finally(() => {
          j(t);
        });
      }, W = (t) => P.get(t), j = (t) => {
        t ? P.delete(t) : P.clear();
      }, V = (t, { cacheKey: e, cacheTime: s = (/* @__PURE__ */ new Date(0)).setMinutes(5), staleTime: n = 0 }) => {
        const { setState: r } = t, a = u.ref(null);
        let i = null;
        const l = (o) => {
          e && (i && (window.clearTimeout(i), i = null), i = window.setTimeout(() => {
            A(e), i = null;
          }, o));
        };
        function h() {
          if (!e) return;
          const o = F(e);
          o && r({ data: o.data, params: o.params }), a.value = E(e, (c) => {
            r({ data: c.data, params: c.params });
          });
        }
        h();
        const f = () => {
          if (!e) return null;
          const o = F(e);
          return !o || Date.now() - o.time > n ? null : true;
        };
        return { onBefore: () => f() ? { isStaleTime: true } : { isStaleTime: false }, onRequest: (o) => {
          if (!e) return o;
          let c = W(e);
          return c ? () => c : (c = o(), M(e, c), () => c);
        }, onSuccess: (o, c) => {
          var _a;
          if (!e) return;
          const g = { data: o, params: c, time: Date.now() };
          (_a = a.value) == null ? void 0 : _a.call(a), a.value = E(e, (p) => {
            r({ data: p.data, params: p.params });
          }), O(e, g), L(e, g), l(s);
        }, onCancel: () => {
          var _a;
          (_a = a.value) == null ? void 0 : _a.call(a);
        } };
      }, D = (t, { errorRetryCount: e = 0, errorRetryInterval: s }) => {
        const n = u.ref(0), r = u.ref(true), { refresh: a } = t, i = u.computed(() => 1e3 * Math.pow(2, n.value)), l = () => {
          n.value = 0, r.value = false;
        }, h = async () => {
          let { is: o, value: c } = R(u.toValue(s));
          o || (c = u.toValue(i)), await S(c), a();
        }, f = async () => {
          const { is: o, value: c } = R(u.toValue(e), true);
          o && (n.value++, c === -1 || n.value <= c ? await h() : n.value = 0);
        };
        return { onError: () => {
          r.value ? f() : r.value = true;
        }, onCancel: () => {
          l();
        } };
      }, N = (t, { pollingInterval: e }) => {
        const { refresh: s } = t;
        let n = null;
        const r = () => {
          const { is: i, value: l } = R(u.toValue(e));
          i && (a(), n = window.setInterval(s, l));
        }, a = () => {
          n && window.clearInterval(n), n = null;
        };
        return { onBefore: () => {
          r();
        }, onCancel: () => {
          a();
        } };
      }, z = (t, { refreshDeps: e = [], refreshDepsAction: s }) => {
        const { refresh: n } = t, r = u.watch(e, () => {
          if (s) return s();
          n();
        }, { deep: true });
        return { onCancel: () => {
          r();
        } };
      }, U = (t, { refocusTimespan: e = 5e3, refreshOnWindowFocus: s }) => {
        const { refresh: n } = t, r = u.ref(true);
        function a() {
          s && (window.addEventListener("focus", i), window.document.addEventListener("visibilitychange", i));
        }
        a();
        async function i() {
          const { is: l, value: h } = R(e);
          l && window.document.visibilityState === "visible" && navigator.onLine && r.value && (n(), r.value = false, await S(h), r.value = true);
        }
        return { onCancel: () => {
          window.removeEventListener("focus", i), window.document.removeEventListener("visibilitychange", i);
        } };
      }, G = (t, { manual: e, ready: s = u.ref(true) }) => {
        const n = u.computed(() => u.toValue(s)), r = u.watch(n, (a) => {
          !e && a && t.refresh();
        });
        return { onBefore: () => {
          if (n.value) return { isReady: true };
        }, onCancel: () => {
          r();
        } };
      };
      function H(t, e, s) {
        var n = null, r = null, a = typeof s == "boolean" ? { leading: s, trailing: !s } : Object.assign({ leading: false, trailing: true }, s), i = false, l = null, h = a.leading, f = a.trailing, o = function() {
          n = null, r = null;
        }, c = function() {
          i = true, t.apply(r, n), o();
        }, g = function() {
          if (h === true && (l = null), i) {
            o();
            return;
          }
          if (f === true) {
            c();
            return;
          }
          o();
        }, p = function() {
          var w = l !== null;
          return w && clearTimeout(l), o(), l = null, i = false, w;
        }, v = function() {
          i = false, n = arguments, r = this, l === null ? h === true && c() : clearTimeout(l), l = setTimeout(g, e);
        };
        return v.cancel = p, v;
      }
      const J = (t, { debounceWait: e, debounceOptions: s, manual: n }) => {
        let r = n, a = null;
        const i = u.computed(() => u.toValue(e)), l = u.computed(() => u.toValue(s)), h = t.runAsync;
        return r || (r = true), u.watchEffect(() => {
          C(i.value) || (a = H((f) => f(), i.value, l.value), t.runAsync = (...f) => new Promise((o, c) => {
            r ? (r = false, h(...f).then(o).catch(c)) : a(() => {
              h(...f).then(o).catch(c);
            });
          }), u.onWatcherCleanup(() => {
            a == null ? void 0 : a.cancel(), t.runAsync = h;
          }));
        }), { onCancel: () => {
          a == null ? void 0 : a.cancel(), a = null, r = false;
        } };
      };
      function Q(t, e, s) {
        var n = null, r = null, a = false, i = null, l = Object.assign({ leading: true, trailing: true }, s), h = l.leading, f = l.trailing, o = function() {
          n = null, r = null;
        }, c = function() {
          a = true, t.apply(r, n), i = setTimeout(g, e), o();
        }, g = function() {
          if (i = null, a) {
            o();
            return;
          }
          if (f === true) {
            c();
            return;
          }
          o();
        }, p = function() {
          var w = i !== null;
          return w && clearTimeout(i), o(), i = null, a = false, w;
        }, v = function() {
          if (n = arguments, r = this, a = false, i === null && h === true) {
            c();
            return;
          }
          f === true && (i = setTimeout(g, e));
        };
        return v.cancel = p, v;
      }
      const X = [D, N, z, U, I, G, J, (t, { throttleWait: e, throttleOptions: s }) => {
        let n = null;
        const r = u.computed(() => u.toValue(e)), a = u.computed(() => u.toValue(s)), i = t.runAsync;
        return u.watchEffect(() => {
          C(r.value) || (n = Q((l) => l(), r.value, a.value), t.runAsync = (...l) => new Promise((h, f) => {
            n(() => {
              i(...l).then(h).catch(f);
            });
          }), u.onWatcherCleanup(() => {
            n == null ? void 0 : n.cancel(), t.runAsync = i;
          }));
        }), { onCancel: () => {
          n == null ? void 0 : n.cancel(), n = null;
        } };
      }, V];
      function Y(t, e, s) {
        return B(t, e, [...s || [], ...X]);
      }
      d.useRequest = Y, Object.defineProperty(d, Symbol.toStringTag, { value: "Module" });
    });
  }
});
export default require_vue3_request_umd();
//# sourceMappingURL=vue3-request.js.map
