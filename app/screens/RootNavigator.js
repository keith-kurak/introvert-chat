import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
//import MainTabs from './MainTabs';
import { ChatScreen, VoiceToggleHeaderButton } from "./ChatScreen";
import { StoreProvider } from "../stores/RootStore";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={() => ({
                headerRight: () => <VoiceToggleHeaderButton />,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

export default RootNavigator;
