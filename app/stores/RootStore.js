import { types } from "mobx-state-tree";
import { sortBy } from "lodash";
import React from "react";
import ThreadStore from './ThreadStore';
import { nowAsString } from './utils';

// create a RootStore that keeps all the state for the app
const RootStore = types
  .model("RootStore", {
    threadStore: types.optional(ThreadStore, {}),
    isLoggedIn: types.optional(types.boolean, true), // set to true for now since we don't really have login sessions yet
  })
  .views((self) => ({
    get threadsSorted() {
      return sortBy(self.threads, (c) => c.id);
    },
  }))
  .actions((self) => {

    const login = () => {
      self.isLoggedIn = true;
    };

    const logout = () => {
      self.isLoggedIn = false;
    };

    return {
      login,
      logout,
    };
  });

// Create a Provider that creates a singleton for the RootStore, wrap it in a Provider component, and create a custom hook to make it easy to use

const StoreContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
  const store = RootStore.create({ threadStore: { messages: [ {
    id: '1',
    text: "Hey, you! What's going on?",
    sender: 'voice',
    date: nowAsString(),
  }] } });
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

// We'll use this this to use the store in screen components
export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    // not likely, but sure
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
