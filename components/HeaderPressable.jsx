import { Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export const HeaderPressable = ({ onPress, ...props }) => {
  const tap = Gesture.Tap().runOnJS(true).onEnd(onPress);

  return (
    <GestureDetector gesture={tap}>
      <Pressable {...props} />
    </GestureDetector>
  );
};

