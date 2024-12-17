import { observable, Observable } from "@legendapp/state";
import { configureSynced, synced } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import * as Crypto from "expo-crypto";
import { sortBy } from "lodash";

export type MessageTokenType = "heading" | "paragraph" | "listItem";

interface Message {
  id: string;
  text: string;
  tokenType: MessageTokenType;
  date: Date;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  creationDate?: Date;
}

interface Store {
  threads: Thread[];
  threadsSorted: Thread[];
  addThread: (title: string) => Thread;
  addMessage: (
    threadId: string,
    text: string,
    tokenType?: MessageTokenType
  ) => void;
  setTokenType: (
    threadId: string,
    messageId: string,
    tokenType: MessageTokenType
  ) => void;
}

// Setup a configured persist options
const mySynced = configureSynced(synced, {
  persist: {
    plugin: ObservablePersistLocalStorage,
  },
});

function nextId() {
  return Crypto.randomUUID();
}

export const store$ = observable<Store>({
  threads: mySynced({
    initial: [],
    persist: {
      name: "threads",
    },
  }),
  threadsSorted: () =>
    sortBy(store$.threads.get(), (t: Thread) => t.creationDate).reverse(),
  addThread: (title: string) => {
    const thread: Thread = {
      id: nextId(),
      title: title,
      messages: [],
      creationDate: new Date(),
    };
    store$.threads.push(thread);
    return thread;
  },
  addMessage: (
    threadId: string,
    text: string,
    tokenType?: MessageTokenType
  ) => {
    const thread = store$.threads.find((t) => t.id.get() === threadId);
    if (!thread) {
      return;
    }
    const message: Message = {
      id: nextId(),
      text: text,
      tokenType: tokenType || "paragraph",
      date: new Date(),
    };
    thread.messages.push(message);
  },
  setTokenType: (
    threadId: string,
    messageId: string,
    tokenType: MessageTokenType
  ) => {
    const thread = store$.threads.find((t) => t.id.get() === threadId);
    if (!thread) {
      return;
    }
    const message = thread.messages.find((m) => m.id.get() === messageId);
    if (!message) {
      return;
    }
    message.tokenType.set(tokenType);
  },
});
