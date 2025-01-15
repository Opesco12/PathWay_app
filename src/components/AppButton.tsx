import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";

const AppButton = ({
  customStyles,
  disabled,
  textColor = Colors.white,
  onPress,
  children,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
            opacity: disabled === true ? 0.5 : 1,
          },
          customStyles,
        ]}
      >
        <StyledText
          type="title"
          variant="medium"
          color={textColor}
        >
          {children}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 10,
    height: 53,
    justifyContent: "center",
  },
});

export default AppButton;
