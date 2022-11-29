import { types } from "mobx-state-tree";
import { sortBy } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import React from "react";

const nowAsString = () => DateTime.now().toSQL();

const sqlDateToJsDate = (sqlDate) => DateTime.fromSQL(sqlDate).toJSDate();

// better structure: Prompt -> Thread -> Message
// even better: Thread -> Message (thread is individual question at individual point in time, threads have tags that relate to each other)

const Message = types.model("Message", {
  id: types.identifier,
  text: types.string,
  sender: types.string, // "voice" or "user"
  date: types.string,
}).views(self => ({
  get JsDate() {
    return sqlDateToJsDate(self.date);
  }
}));

const Prompt = types.model("Prompt", {
  id: types.identifier,
  shortName: types.string,
  question: types.string,
  category: types.string,
});

// create a type used by your RootStore
const Thread = types.model("Thread", {
  id: types.identifier,
  promptId: types.string,
  date: types.string, // string date
  question: types.string,
  messages: types.optional(types.array(Message), []),
}.views(self => ({
  get messagesSorted() {
    return sortBy(self.messages, (c) => c.id);
  },
  get JsDate() {
    return sqlDateToJsDate(self.date);
  }
}))).actions(self => ({
  addMessage(text, sender) {
    self.messages.push({
      id: uuidv4(),
      text,
      sender,
      date: nowAsString(),
    });
  }
}));

// create a RootStore that keeps all the state for the app
const RootStore = types
  .model("RootStore", {
    threads: types.optional(types.array(Thread), []),
    prompts: types.optional(types.array(Prompt), []),
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
        id: uuidv4(),
        name,
        question,
        date: nowAsString(),
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
    prompt: "What was the best thing that happened this week?",
    category: 'this_week1'
  },
  {
    id: 1,
    name: "Books",
    prompt: "Have you read any good books lately?",
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
