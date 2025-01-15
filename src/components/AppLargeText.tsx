import { StyleSheet, Text } from "react-native";

import { Colors } from "@/src/constants/Colors";

const AppLargeText = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
    fontSize: 31,
    marginTop: 25,
  },
});

export default AppLargeText;
