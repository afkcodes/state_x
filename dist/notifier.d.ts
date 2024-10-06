import { ListenerCallback } from './types/store.types';
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
declare class ChangeNotifier<T> {
    private static instance;
    private listeners;
    private notifierState;
    private actionSet;
    private constructor();
    /**
     * Gets the singleton instance of ChangeNotifier.
     * @returns {ChangeNotifier<T>} - The singleton instance of ChangeNotifier.
     */
    static getInstance<T>(): ChangeNotifier<T>;
    /**
     * Validates whether the event name is a non-empty string.
     * @param {string} eventName - The name of the event.
     * @returns {boolean} - True if the event name is valid, otherwise false.
     */
    private validateEvent;
    /**
     * Notifies all subscribed callbacks of a specific event slice with provided data.
     * @param {string} eventName - The name of the event.
     * @param {T} data - The data associated with the event slice.
     * @param {string} sliceName - The name of the slice within the event.
     * @param {string} caller - The identifier of the caller.
     * @throws Will throw an error if the event name is invalid.
     * @returns {void}
     */
    notify(eventName: string, data: Partial<T>, sliceName: string, transient?: boolean, caller?: string): void;
    /**
     * Subscribes a callback function to a specific event slice.
     * @param {string} eventName - The name of the event.
     * @param {ListenerCallback<T>} callback - The callback function to be invoked on event notification.
     * @param {T} initialState - The initial state associated with the event slice.
     * @param {string} sliceName - The name of the slice within the event.
     * @throws Will throw an error if the event name or callback function is invalid.
     * @returns {void}
     */
    listen(eventName: string, callback: ListenerCallback<T>, initialState: T | undefined, sliceName: string): void;
    /**
     * Unsubscribes a callback function from a specific event slice.
     * @param {string} eventName - The name of the event.
     * @param {ListenerCallback<T>} callback - The callback function to be unsubscribed.
     * @param {string} sliceName - The name of the slice within the event.
     * @throws Will throw an error if no listeners are found for the specified event.
     * @returns {void}
     */
    unsubscribe(eventName: string, callback: ListenerCallback<T>, sliceName: string): void;
    /**
     * Retrieves the current state data of a specific event slice.
     * @param {string} eventName - The name of the event.
     * @param {string} sliceName - The name of the slice within the event.
     * @returns {T | undefined} - The current state data of the event slice, or undefined if not found.
     */
    getState(eventName: string, sliceName: string): T | undefined;
    /**
     * Registers an action callback for a specific slice.
     * @param {Function} callback - The action callback to register.
     * @param {string} slice - The slice identifier.
     * @returns {void}
     */
    registerAction(callback: Function, slice: string): void;
    unregisterAction(callback: Function, slice: string): void;
    /**
     * Gets the action set.
     * @private
     * @returns {ActionSet} - The action set.
     */
    private getActionSet;
}
export default ChangeNotifier;
