import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { observer } from "@legendapp/state/react";
import { store$ } from "@/lib/stores";
import { useLocalSearchParams, Stack } from "expo-router";

const ThreadScreen = observer(() => {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();

  const thread = store$.threads.get().find((t) => t.id === threadId);
  const messages = thread?.messages.map((message) => ({
    _id: message.id,
    text: message.text,
    createdAt: message.date,
    user: {
      _id: message.isHeading ? "heading" : "message",
    },
    actualMessage: message,
  })).reverse();

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (thread) {
        newMessages.forEach((message) => {
          store$.addMessage(thread.id, message.text, false);
        });
      }
    },
    [thread]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: thread?.title,
        }}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: "message",
        }}
        renderTime={() => null}
        onPress={(context, message) => {
          store$.toggleHeading(threadId, message._id.toString());
        }}
        renderAvatar={null}
      />
    </>
  );
});

export default ThreadScreen;
