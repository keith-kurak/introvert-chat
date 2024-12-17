import React, { useState, useCallback, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { observer } from "@legendapp/state/react";
import { store$ } from "@/lib/stores";
import { useLocalSearchParams, Stack } from "expo-router";
import { Chat } from "@/components/chat/Chat";

const ThreadScreen = observer(() => {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();

  const thread = store$.threads.get().find((t) => t.id === threadId);
  const messages = (thread?.messages || []).slice().reverse();

  return (
    <>
      <Stack.Screen
        options={{
          title: thread?.title,
        }}
      />
      <Chat
        messages={messages}
        onSubmit={(message, tokenType) =>
          store$.addMessage(thread!.id, message, tokenType || "paragraph")
        }
        onSetTokenType={(id, tokenType) =>
          store$.setTokenType(thread!.id, id, tokenType)
        }
      />
    </>
  );
});

export default ThreadScreen;
