import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { observer } from "mobx-react-lite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderIcon from "../components/HeaderIcon";
import { useStore } from "../stores/RootStore";

const VoiceToggleHeaderButton = observer(() => {
  const { threadStore } = useStore();
  const { setSender, sender } = threadStore;
  return (
    <HeaderIcon
      name="chat-question-outline"
      onPress={() => {
        setSender(sender === "user" ? "voice" : "user");
      }}
      isSelectable
      isSelected={sender === "voice"}
    />
  );
});

const ChatScreen = observer(() => {
  const insets = useSafeAreaInsets();
  const { threadStore } = useStore();
  const { addMessage, sender, messagesSorted } = threadStore;

  const messagesFinal = messagesSorted.map((message) => {
    return {
      _id: message.id,
      text: message.text,
      createdAt: message.jsDate,
      user: {
        _id: message.sender,
        name: message.sender,
      },
    };
  });

  const onSend = useCallback(
    (messages = []) => {
      addMessage(messages[0].text);
    },
    [addMessage]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GiftedChat
        messages={messagesFinal}
        onSend={onSend}
        user={{
          _id: "user", //always keeps user messaes on the right
        }}
        placeholder={sender === "user" ? "Write a response..." : "Ask a question..."}
        bottomOffset={insets.bottom}
      />
    </View>
  );
});

export { ChatScreen, VoiceToggleHeaderButton };
