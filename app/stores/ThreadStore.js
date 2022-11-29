import { types } from "mobx-state-tree";
import { sortBy } from "lodash";
import uuid from 'react-native-uuid';
import { nowAsString, sqlDateToJsDate } from './utils';

const uuidv4 = uuid.v4;

const Message = types.model("Message", {
  id: types.identifier,
  text: types.string,
  sender: types.string, // "voice" or "user"
  date: types.string,
}).views(self => ({
  get jsDate() {
    return sqlDateToJsDate(self.date);
  }
}));

const ThreadStore = types.model("ThreadStore", {
  messages: types.optional(types.array(Message), []),
  sender: types.optional(types.string, 'user'), // user or voice
}).views(self => ({
  get messagesSorted() {
    return sortBy(self.messages.slice(), m => m.jsDate).reverse();
  }
})).actions(self => {
  const setSender = function(sender) {
    self.sender = sender;
  }

  const addMessage = function(text) {
    self.messages.push({
      id: uuidv4(),
      text,
      sender: self.sender,
      date: nowAsString(),
    });
  }

  return {
    setSender,
    addMessage
  }
});

export default ThreadStore;
