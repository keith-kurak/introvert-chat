import { types } from "mobx-state-tree";
import { sortBy } from "lodash";
import React from "react";

// better structure: Prompt -> Thread -> Message
// even better: Thread -> Message (thread is individual question at individual point in time, threads have tags that relate to each other)

const Message = types.model("Message", {
  id: types.identifierNumber,
  text: types.string,
  sender: types.string, // "voice" or "user"
});

// create a type used by your RootStore
const Threads = types.model("Thread", {
  id: types.identifierNumber,
  name: types.string,
  date: types.string, // string date
  category: types.string,
  //relatedCategories: types.optional(types.array(types.string), []), // maybe shouldn't be part of thread
  question: types.string,
  messages: types.optional(types.array(Message), []),
}.views(self => ({
  get messagesSorted() {
    return sortBy(self.messages, (c) => c.id);
  },
}))).actions(self => ({
  addMessage(text, sender) {
    self.messages.push({
      id: self.messages.length + 1,
      text,
      sender,
    });
  }
}));

// create a RootStore that keeps all the state for the app
const RootStore = types
  .model("RootStore", {
    threads: types.optional(types.array(Threads), []),
    isLoggedIn: types.optional(types.boolean, true), // set to true for now since we don't really have login sessions yet
  })
  .views((self) => ({
    get threadsSorted() {
      return sortBy(self.threads, (c) => c.id);
    },
  }))
  .actions((self) => {
    const addThread = ({ name, question }) => {
      self.threads.push({
        id: self.threads.length,
        name,
        question,
      });
    };

    const login = () => {
      self.isLoggedIn = true;
    };

    const logout = () => {
      self.isLoggedIn = false;
    };

    return {
      addThread,
      login,
      logout,
    };
  });

const mockThreads = [
  {
    id: 0,
    name: "This Week",
    question: "What was the best thing that happened this week?",
    category: 'this_week1'
  },
  {
    id: 1,
    name: "Books",
    question: "Have you read any good books lately?",
    category: 'books1'
  }
]

// Create a Provider that creates a singleton for the RootStore, wrap it in a Provider component, and create a custom hook to make it easy to use

const StoreContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
  const store = RootStore.create({ threads: mockThreads });
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
