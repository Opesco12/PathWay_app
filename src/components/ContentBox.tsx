import { StyleSheet, Text, View, Pressable } from "react-native";

import { Colors } from "@/src/constants/Colors";

const ContentBox = ({ children, customStyles, width, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: width }}
    >
      <View style={[styles.container, customStyles]}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    flex: 1,
  },
});

export default ContentBox;
