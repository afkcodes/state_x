/**
 * Represents the action set for managing state.
 * @typedef {Object} ActionSet
 * @property {Set<Function>} slice - The slice identifier.
 */
type ActionSet = { [slice in string]: Set<Function> };

/**
 * Represents a callback function that listens to changes notified by the ChangeNotifier.
 * @template T - The type of data being passed to the callback.
 * @param {T} data - The data passed to the callback.
 * @param {ActionSet} actionSet - The data passed to the callback.
 * @param {T} prevState - The data passed to the callback.
 * @returns {void}
 */
type ListenerCallback<T> = (
  data: T,
  actionSet: ActionSet,
  prevState: T,
  transient?: boolean,
) => void;

export { type ActionSet, type ListenerCallback };
