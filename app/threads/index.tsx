import React, { useState } from "react";
import { observer } from "@legendapp/state/react";
import { store$ } from "@/lib/stores";
import {
  FlatList,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Stack, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default observer(() => {
  const [showInput, setShowInput] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");

  const threads = store$.threadsSorted.get();

  const addThread = () => {
    if (newThreadTitle.trim()) {
      store$.addThread(newThreadTitle);
      setNewThreadTitle("");
      setShowInput(false);
    }
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: "Threads",
          headerRight: () => (
            <TouchableOpacity
              className="p-2"
              onPress={() => setShowInput(!showInput)}
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      {showInput && (
        <TextInput
          className="border p-2 mb-4"
          placeholder="Enter thread title"
          value={newThreadTitle}
          onChangeText={setNewThreadTitle}
          onSubmitEditing={addThread}
          autoFocus
        />
      )}
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="h-0.5 bg-slate-300" />}
        renderItem={({ item }) => (
          <Link asChild href={`/threads/${item.id}`}>
            <Pressable>
              <View className="my-4">
                <Text className="text-xl font-bold">{item.title}</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
});
