import { TouchableOpacity, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../theme";

export default function HeaderIcon({ name, onPress, isSelectable = false, isSelected = false }) {
  const { colors } = useTheme();
  const Touchable = isSelectable ?  Pressable : TouchableOpacity;
  return (
    <Touchable onPress={onPress}>
      <MaterialCommunityIcons
        name={name}
        size={30}
        color={isSelectable ? (isSelected ? colors.tint : colors.secondary) : colors.primary}
      />
    </Touchable>
  );
}
