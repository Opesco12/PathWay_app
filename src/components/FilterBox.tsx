import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";

const FilterBox = ({ text, onPress, selected, style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        { borderColor: selected ? Colors.primary : Colors.lightPrimary },
      ]}
      onPress={onPress}
    >
      <StyledText
        type="body"
        variant="medium"
        color={selected ? Colors.white : Colors.lightPrimary}
      >
        {text}
      </StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  text: { fontSize: 15, color: Colors.lightPrimary },
});

export default FilterBox;
