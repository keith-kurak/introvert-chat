import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import classnames from "classnames";
import { MessageTokenType } from "@/lib/stores";
import { first, last } from "lodash";

interface Props {
  messages: { id: string; text: string; tokenType: MessageTokenType }[];
  onSubmit: (text: string, tokenType?: MessageTokenType) => void;
  onSetTokenType: (id: string, tokenType: MessageTokenType) => void;
}

export const Chat = (props: Props) => {
  const { messages, onSubmit, onSetTokenType } = props;

  const [selectedMessageId, setSelectedMessageId] = useState<
    string | undefined
  >(undefined);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const [text, setText] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const toggleSelectedMessageId = (id: string) => {
    if (selectedMessageId === id) {
      setSelectedMessageId(undefined);
    } else {
      setSelectedMessageId(id);
    }
  };

  const onPressSend = () => {
    if (!text) return;
    if (first(messages)?.tokenType === "listItem") {
      onSubmit(text, "listItem");
    } else {
      onSubmit(text);
    }
    setText("");
    setSelectedMessageId(undefined);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const onPressTokenType = (id: string, tokenType: MessageTokenType) => {
    onSetTokenType(id, tokenType);
    setSelectedMessageId(undefined);
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleSelectedMessageId(item.id)}>
            <View
              className={
                selectedMessageId === item.id
                  ? "bg-blue-600"
                  : item.tokenType === "heading"
                  ? "bg-neutral-300"
                  : ""
              }
            >
              <View
                className={classnames(
                  item.tokenType === "heading"
                    ? "pl-2"
                    : item.tokenType === "listItem"
                    ? "pl-6"
                    : "pl-4",
                  "p-2"
                )}
              >
                <Text
                  className={classnames(
                    item.tokenType === "heading" ? "text-2xl" : "text-l",
                    selectedMessageId === item.id ? "text-white" : ""
                  )}
                >
                  {item.tokenType === "listItem" ? `• ${item.text}` : item.text}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        inverted
      />
      <View className="flex-row m-2 items-center">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          className="flex-1 p-4 border border-gray-300 rounded"
          multiline
        />
        <TouchableOpacity onPress={onPressSend} className="pl-2">
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
      <View
        className={classnames(
          "absolute top-0 left-0 right-0 bg-white",
          selectedMessageId ? "" : "hidden"
        )}
      >
        <View className="flex-row">
          <TokenTypeButton
            selected={selectedMessage?.tokenType === "heading"}
            onPress={() => onPressTokenType(selectedMessageId!, "heading")}
            label="Heading"
          />
          <TokenTypeButton
            selected={selectedMessage?.tokenType === "paragraph"}
            onPress={() => onPressTokenType(selectedMessageId!, "paragraph")}
            label="Paragraph"
          />
          <TokenTypeButton
            selected={selectedMessage?.tokenType === "listItem"}
            onPress={() => onPressTokenType(selectedMessageId!, "listItem")}
            label="List"
          />
        </View>
      </View>
    </View>
  );
};

interface TokenTypeButtonProps {
  selected: boolean;
  onPress: () => void;
  label: string;
}

const TokenTypeButton: React.FC<TokenTypeButtonProps> = ({
  selected,
  onPress,
  label,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className={classnames("p-2", selected && "bg-blue-600")}>
        <Text className={classnames("text-lg", selected ? "color-white" : "")}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
