var j = Object.defineProperty;
var d = (e, t, s) => t in e ? j(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var h = (e, t, s) => d(e, typeof t != "symbol" ? t + "" : t, s);
import { useState as I, useEffect as L } from "react";
const $ = (e) => typeof e == "object" && e !== null && !Array.isArray(e) && e.constructor === Object, y = (e, t) => {
  if (e === null && t === null)
    return !0;
  if (e === null || t === null || typeof e != typeof t)
    return !1;
  if (typeof e != "object")
    return e === t;
  if (Array.isArray(e) && Array.isArray(t))
    return e.length !== t.length ? !1 : e.every((n, o) => y(n, t[o]));
  const s = Object.keys(e), r = Object.keys(t);
  return s.length !== r.length ? !1 : s.every((n) => r.includes(n) ? y(e[n], t[n]) : !1);
}, O = (e) => e instanceof Function && typeof e == "function", f = class f {
  constructor() {
    h(this, "listeners", {});
    h(this, "notifierState", {});
    h(this, "actionSet", {});
  }
  /**
   * Gets the singleton instance of ChangeNotifier.
   * @returns {ChangeNotifier<T>} - The singleton instance of ChangeNotifier.
   */
  static getInstance() {
    return f.instance || (f.instance = new f()), f.instance;
  }
  /**
   * Validates whether the event name is a non-empty string.
   * @param {string} eventName - The name of the event.
   * @returns {boolean} - True if the event name is valid, otherwise false.
   */
  validateEvent(t) {
    return !!(t && typeof t == "string");
  }
  /**
   * Notifies all subscribed callbacks of a specific event slice with provided data.
   * @param {string} eventName - The name of the event.
   * @param {T} data - The data associated with the event slice.
   * @param {string} sliceName - The name of the slice within the event.
   * @param {string} caller - The identifier of the caller.
   * @throws Will throw an error if the event name is invalid.
   * @returns {void}
   */
  notify(t, s, r, n = !1, o = "notifier_default") {
    if (!this.validateEvent(t))
      throw new Error(`Invalid event name: '${t}'`);
    if (!this.listeners[t]) {
      console.warn(`No listeners for event: '${t}' called by '${o}'.`);
      return;
    }
    const c = this.listeners[t][r];
    if (!c) {
      console.warn(
        `No listeners found for slice: '${r}' of event: '${t}' called by '${o}'.`
      );
      return;
    }
    const u = this.notifierState[t][r], S = $(s) ? { ...u || {}, ...s } : s;
    y(u, S) ? console.warn("notify rejected as the previous state and current state are same.") : (this.notifierState[t][r] = S, c.forEach(
      (i) => i(S, this.getActionSet(), u, n)
    ));
  }
  /**
   * Subscribes a callback function to a specific event slice.
   * @param {string} eventName - The name of the event.
   * @param {ListenerCallback<T>} callback - The callback function to be invoked on event notification.
   * @param {T} initialState - The initial state associated with the event slice.
   * @param {string} sliceName - The name of the slice within the event.
   * @throws Will throw an error if the event name or callback function is invalid.
   * @returns {void}
   */
  listen(t, s, r = {}, n) {
    if (!this.validateEvent(t) || !O(s))
      throw new Error(`Invalid parameters for event: '${t}'`);
    (!this.listeners[t] || !this.notifierState[t]) && (this.listeners[t] = {}, this.notifierState[t] = {}), this.listeners[t][n] || (this.listeners[t][n] = /* @__PURE__ */ new Set(), this.notifierState[t][n] = r), this.listeners[t][n].add(s);
  }
  /**
   * Unsubscribes a callback function from a specific event slice.
   * @param {string} eventName - The name of the event.
   * @param {ListenerCallback<T>} callback - The callback function to be unsubscribed.
   * @param {string} sliceName - The name of the slice within the event.
   * @throws Will throw an error if no listeners are found for the specified event.
   * @returns {void}
   */
  unsubscribe(t, s, r) {
    if (!this.validateEvent(t) || !this.listeners[t])
      throw new Error(`No listeners found for event: '${t}' to unsubscribe.`);
    const n = this.listeners[t][r];
    (!n || !n.delete(s)) && console.warn(`Cannot unsubscribe to a non-existent listener '${t}'.`);
  }
  /**
   * Retrieves the current state data of a specific event slice.
   * @param {string} eventName - The name of the event.
   * @param {string} sliceName - The name of the slice within the event.
   * @returns {T | undefined} - The current state data of the event slice, or undefined if not found.
   */
  getState(t, s) {
    var r;
    return s ? (r = this.notifierState[t]) == null ? void 0 : r[s] : this.notifierState[t];
  }
  /**
   * Registers an action callback for a specific slice.
   * @param {Function} callback - The action callback to register.
   * @param {string} slice - The slice identifier.
   * @returns {void}
   */
  registerAction(t, s) {
    this.actionSet[s] || (this.actionSet[s] = /* @__PURE__ */ new Set()), this.actionSet[s].add(t);
  }
  unregisterAction(t, s) {
    this.actionSet[s] && (this.actionSet[s].delete(t), this.actionSet[s].size === 0 && delete this.actionSet[s]);
  }
  /**
   * Gets the action set.
   * @private
   * @returns {ActionSet} - The action set.
   */
  getActionSet() {
    return this.actionSet;
  }
};
h(f, "instance");
let g = f;
const V = (e, t, s) => {
  const r = s || `${e.toLowerCase()}_global`, n = g.getInstance(), o = n.getState(e, r), c = (i, l, a, b) => {
    var A;
    const w = !y(i, a);
    !b && w ? (A = l[r]) != null && A.size && l[r].forEach((p) => {
      p && p(typeof i == "object" && i !== null ? (E) => ({ ...E, ...i }) : i);
    }) : w ? b && console.log("Updated store transiently") : console.warn("State update dismissed: previous and current state are same.");
  };
  n.listen(e, c, o || t, r);
  const u = (i) => $(i) ? new Proxy(i, {
    get: (l, a) => n.getState(e, r)[a]
  }) : n.getState(e, r);
  return {
    useStore: () => {
      const [i, l] = I(t);
      return L(() => (n.registerAction(l, r), () => {
        n.unregisterAction(l, r);
      }), []), [
        u(i),
        (a) => {
          n.notify(e, a, r, !1, "create");
        }
      ];
    },
    set: (i) => {
      n.notify(e, i, r, !1, "create_set");
    },
    setTransient: (i) => {
      n.notify(e, i, r, !0, "create_transient");
    },
    getStoreSnapshot: () => n.getState(e, r),
    subscribe: (i) => {
      n.listen(e, i, t, r);
    }
  };
}, z = (e, t, s, r = !1, n = "notifier_global") => {
  const o = g.getInstance(), c = s || `${e.toLowerCase()}_global`;
  o.notify(e, t, c, r, n);
};
export {
  V as create,
  z as notify
};
