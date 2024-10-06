/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ActionSet, ListenerCallback } from './types/store.types';
import { diffChecker, isValidFunction, isValidObject } from './utils/common';

/**
 * Represents the ChangeNotifier module.
 * @module ChangeNotifier
 * @exports ChangeNotifier
 * @author Ashish Kumar
 */

/**
 * Represents a ChangeNotifier that facilitates event notification and subscription.
 * @template T - The type of data associated with the event.
 */
class ChangeNotifier<T> {
  private static instance: ChangeNotifier<any>;
  private listeners: Record<string, Record<string, Set<ListenerCallback<T>>>> = {};
  private notifierState: Record<string, Record<string, T>> = {};
  private actionSet: ActionSet = {} as any;

  private constructor() {}

  /**
   * Gets the singleton instance of ChangeNotifier.
   * @returns {ChangeNotifier<T>} - The singleton instance of ChangeNotifier.
   */
  public static getInstance<T>(): ChangeNotifier<T> {
    if (!ChangeNotifier.instance) {
      ChangeNotifier.instance = new ChangeNotifier();
    }
    return ChangeNotifier.instance;
  }

  /**
   * Validates whether the event name is a non-empty string.
   * @param {string} eventName - The name of the event.
   * @returns {boolean} - True if the event name is valid, otherwise false.
   */
  private validateEvent(eventName: string): boolean {
    return Boolean(eventName && typeof eventName === 'string');
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
  notify(
    eventName: string,
    data: Partial<T>,
    sliceName: string,
    transient: boolean = false,
    caller: string = 'notifier_default',
  ): void {
    if (!this.validateEvent(eventName)) {
      throw new Error(`Invalid event name: '${eventName}'`);
    }

    if (!this.listeners[eventName]) {
      console.warn(`No listeners for event: '${eventName}' called by '${caller}'.`);
      return;
    }

    const sliceListeners = this.listeners[eventName][sliceName];

    if (!sliceListeners) {
      console.warn(
        `No listeners found for slice: '${sliceName}' of event: '${eventName}' called by '${caller}'.`,
      );
      return;
    }

    const prevState = this.notifierState[eventName][sliceName];
    const stateData = isValidObject(data) ? { ...(prevState || {}), ...data } : data;

    if (!diffChecker(prevState, stateData)) {
      this.notifierState[eventName][sliceName] = stateData as T;

      sliceListeners.forEach(cb =>
        cb(stateData as T, this.getActionSet(), prevState, transient),
      );
    } else {
      console.warn('notify rejected as the previous state and current state are same.');
    }
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
  listen(
    eventName: string,
    callback: ListenerCallback<T>,
    initialState: T = {} as T,
    sliceName: string,
  ): void {
    if (!this.validateEvent(eventName) || !isValidFunction(callback)) {
      throw new Error(`Invalid parameters for event: '${eventName}'`);
    }

    if (!this.listeners[eventName] || !this.notifierState[eventName]) {
      this.listeners[eventName] = {};
      this.notifierState[eventName] = {};
    }

    if (!this.listeners[eventName][sliceName]) {
      this.listeners[eventName][sliceName] = new Set<ListenerCallback<T>>();
      this.notifierState[eventName][sliceName] = initialState;
    }

    // if (this.listeners[eventName][sliceName].size === 0) {
    this.listeners[eventName][sliceName].add(callback);
    // }
  }

  /**
   * Unsubscribes a callback function from a specific event slice.
   * @param {string} eventName - The name of the event.
   * @param {ListenerCallback<T>} callback - The callback function to be unsubscribed.
   * @param {string} sliceName - The name of the slice within the event.
   * @throws Will throw an error if no listeners are found for the specified event.
   * @returns {void}
   */
  unsubscribe(eventName: string, callback: ListenerCallback<T>, sliceName: string): void {
    if (!this.validateEvent(eventName) || !this.listeners[eventName]) {
      throw new Error(`No listeners found for event: '${eventName}' to unsubscribe.`);
    }
    const sliceListeners = this.listeners[eventName][sliceName];
    if (!sliceListeners || !sliceListeners.delete(callback)) {
      console.warn(`Cannot unsubscribe to a non-existent listener '${eventName}'.`);
    }
  }

  /**
   * Retrieves the current state data of a specific event slice.
   * @param {string} eventName - The name of the event.
   * @param {string} sliceName - The name of the slice within the event.
   * @returns {T | undefined} - The current state data of the event slice, or undefined if not found.
   */
  getState(eventName: string, sliceName: string): T | undefined {
    return sliceName
      ? this.notifierState[eventName]?.[sliceName]
      : (this.notifierState[eventName] as T);
  }

  /**
   * Registers an action callback for a specific slice.
   * @param {Function} callback - The action callback to register.
   * @param {string} slice - The slice identifier.
   * @returns {void}
   */
  registerAction(callback: Function, slice: string): void {
    if (!this.actionSet[slice]) {
      this.actionSet[slice] = new Set();
    }
    this.actionSet[slice].add(callback);
  }

  unregisterAction(callback: Function, slice: string): void {
    if (this.actionSet[slice]) {
      this.actionSet[slice].delete(callback);
      if (this.actionSet[slice].size === 0) {
        delete this.actionSet[slice];
      }
    }
  }

  /**
   * Gets the action set.
   * @private
   * @returns {ActionSet} - The action set.
   */
  private getActionSet(): ActionSet {
    return this.actionSet;
  }
}

export default ChangeNotifier;
