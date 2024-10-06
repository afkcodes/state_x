import { useEffect, useState } from 'react';
import ChangeNotifier from './notifier';
import { ListenerCallback } from './types/store.types';
import { diffChecker, isValidObject } from './utils/common';

/**
 * Creates a custom hook and related functions for managing state with ChangeNotifier.
 * @template T - The type of the state.
 * @param {string} eventName - The name of the event associated with this state.
 * @param {T} initState - The initial state.
 * @param {string} - The slice identifier for the state.
 * @returns {Object} An object containing the useStore hook and helper functions.
 */
const create = <T>(eventName: string, initState: T, sliceName?: string) => {
  const slice = sliceName ? sliceName : `${eventName.toLowerCase()}_global`;
  const notifier = ChangeNotifier.getInstance<T>();
  const prevState = notifier.getState(eventName, slice);

  /**
   * Callback function to handle state changes.
   * @type {ListenerCallback<T>}
   */
  const listenerCallback: ListenerCallback<T> = (
    data,
    actionSet,
    prevState,
    transient
  ) => {
    const isDifferent = !diffChecker(data, prevState);
    if (!transient && isDifferent) {
      if (actionSet[slice]?.size) {
        actionSet[slice].forEach((callback) => {
          if (callback) {
            if (typeof data === 'object' && data !== null) {
              // If data is an object, merge it with the previous state
              callback((prev: T) => ({ ...prev, ...data } as T));
            } else {
              // If data is not an object, replace the entire state
              callback(data);
            }
          }
        });
      }
    } else if (!isDifferent) {
      console.warn('State update dismissed: previous and current state are same.');
    } else if (transient) {
      console.log('Updated store transiently');
    }
  };

  // Register the listener at the create level
  notifier.listen(eventName, listenerCallback, prevState || initState, slice);

  /**
   * Retrieves the current state value, potentially wrapped in a Proxy for object states.
   * @param {T} state - The current state.
   * @returns {T} The current state value, possibly wrapped in a Proxy.
   */
  const getStateValue = (state: T): T => {
    if (isValidObject(state)) {
      // Create a Proxy for object states to ensure we always get the latest values
      return new Proxy(state as Record<string, unknown>, {
        get: (_target, prop: string) => {
          const currentState = notifier.getState(eventName, slice) as T;
          return (currentState as Record<string, unknown>)[prop];
        },
      }) as T;
    }
    return notifier.getState(eventName, slice) as T;
  };

  /**
   * Custom hook for managing state.
   * @returns {[T, (data: Partial<T>) => void]} A tuple containing the current state and a function to update it.
   */
  const useStore = (): [T, (data: Partial<T>) => void] => {
    const [state, setState] = useState<T>(initState);

    useEffect(() => {
      // Register the action when the component mounts
      notifier.registerAction(setState, slice);

      // Cleanup function to unregister the action when the component unmounts
      return () => {
        notifier.unregisterAction(setState, slice);
      };
    }, []);

    return [
      getStateValue(state),
      (data: Partial<T>) => {
        notifier.notify(eventName, data, slice, false, 'create');
      },
    ];
  };

  return {
    useStore,
    set: (data: Partial<T>) => {
      notifier.notify(eventName, data, slice, false, 'create_set');
    },
    setTransient: (data: Partial<T>) => {
      notifier.notify(eventName, data, slice, true, 'create_transient');
    },
    getStoreSnapshot: () => notifier.getState(eventName, slice) as T,
    subscribe: (cb: ListenerCallback<T>) => {
      notifier.listen(eventName, cb, initState, slice);
    },
  };
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
const notify = <T>(
  eventName: string,
  data: Partial<T>,
  sliceName?: string,
  transient: boolean = false,
  caller = 'notifier_global'
) => {
  const notifier = ChangeNotifier.getInstance<T>();
  const slice = sliceName ? sliceName : `${eventName.toLowerCase()}_global`;
  notifier.notify(eventName, data, slice, transient, caller);
};

export { create, notify };
