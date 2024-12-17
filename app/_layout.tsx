import { Stack } from "expo-router";
import { View } from "react-native";

// Import your global CSS file
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  initialRouteName: "threads/index"
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>  
      <Stack />
    </GestureHandlerRootView>
  );
}
