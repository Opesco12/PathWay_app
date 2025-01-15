import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";

const SavingDetails = ({ title, detail, icon }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        {icon}
        <StyledText
          type="label"
          variant="semibold"
          color={Colors.lightPrimary}
        >
          {title}
        </StyledText>
      </View>
      <StyledText
        type="subheading"
        variant="medium"
        color={Colors.primary}
      >
        {detail}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
  },
});

export default SavingDetails;
