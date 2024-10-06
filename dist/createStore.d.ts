import { ListenerCallback } from './types/store.types';
/**
 * Creates a custom hook and related functions for managing state with ChangeNotifier.
 * @template T - The type of the state.
 * @param {string} eventName - The name of the event associated with this state.
 * @param {T} initState - The initial state.
 * @param {string} - The slice identifier for the state.
 * @returns {Object} An object containing the useStore hook and helper functions.
 */
declare const create: <T>(eventName: string, initState: T, sliceName?: string) => {
    useStore: () => [T, (data: Partial<T>) => void];
    set: (data: Partial<T>) => void;
    setTransient: (data: Partial<T>) => void;
    getStoreSnapshot: () => T;
    subscribe: (cb: ListenerCallback<T>) => void;
};
/**
 * Notifies a state change for a specific event and slice.
 * @template T - The type of the state.
 * @param {string} event - The name of the event.
 * @param {Partial<T>} data - The new state data.
 * @param {string} - The slice identifier.
 * @param {boolean} [transient=false] - Whether the update is transient.
 * @param {string} [caller='notifier_global'] - The caller identifier.
 */
declare const notify: <T>(eventName: string, data: Partial<T>, sliceName?: string, transient?: boolean, caller?: string) => void;
export { create, notify };
