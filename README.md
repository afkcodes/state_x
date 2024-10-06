# ChangeNotifier and Custom Store Hook

This repository provides a `ChangeNotifier` module for managing state changes and a custom hook creator function (`create`) for integrating state management into React components.

## Overview

The `ChangeNotifier` module facilitates event notification and subscription, allowing components to listen for state changes and react accordingly. The custom hook creator function `create` allows you to define hooks for specific state slices and manage their updates efficiently.

## Modules

### ChangeNotifier

The `ChangeNotifier` class is a singleton that helps manage state changes across different components.

#### Key Features

- **Singleton Pattern:** Ensures only one instance of `ChangeNotifier` is used.
- **Event Notification:** Allows components to notify and listen for state changes.
- **State Management:** Manages state slices and updates listeners with new state data.

#### Methods

- **getInstance():** Returns the singleton instance of `ChangeNotifier`.
- **notify(eventName, data, sliceName, transient, caller):** Notifies all subscribed callbacks of a specific event slice with provided data.
- **listen(eventName, callback, initialState, sliceName):** Subscribes a callback function to a specific event slice.
- **unsubscribe(eventName, callback, sliceName):** Unsubscribes a callback function from a specific event slice.
- **getState(eventName, sliceName):** Retrieves the current state data of a specific event slice.
- **registerAction(callback, slice):** Registers an action callback for a specific slice.
- **getActionSet():** Returns the action set.

### create

The `create` function generates a custom hook for managing state with `ChangeNotifier`.

#### Usage

```javascript
import { create } from './createStore';

const { useStore, set, setTransient, getStoreSnapshot, subscribe } = create('eventName', initialState, 'sliceName');
```

#### Functions

- **useStore():** Custom hook for managing state. Returns the current state and a function to update the state.
- **set(data):** Updates the state with the provided data.
- **setTransient(data):** Updates the state transiently with the provided data.
- **getStoreSnapshot():** Returns the current state snapshot.
- **subscribe(callback):** Subscribes a callback to state changes.

## Example

### ChangeNotifier (Example)

```javascript
import ChangeNotifier from './ChangeNotifier';

const notifier = ChangeNotifier.getInstance();

// Listening for state changes
notifier.listen('eventName', (data, actionSet, prevState, transient) => {
  console.log('State updated:', data);
}, initialState, 'sliceName');

// Notifying state changes
notifier.notify('eventName', newState, 'sliceName');
```

### Custom Hook

```javascript
import React from 'react';
import { create } from './createStore';

const { useStore } = create('eventName', { key: 'value' }, 'sliceName');

const MyComponent = () => {
  const [state, setState] = useStore();

  return (
    <div>
      <p>State: {JSON.stringify(state)}</p>
      <button onClick={() => setState({ key: 'newValue' })}>Update State</button>
    </div>
  );
};

export default MyComponent;
```

## Author

Ashish Kumar
