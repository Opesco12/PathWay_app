import { Pressable, StyleSheet, Text, View } from "react-native";
import { Switch } from "@rneui/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import React from "react";

const AppListItem = React.forwardRef(
  ({ onPress, children, leftIcon, rightIcon = true, style }, ref) => {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
      >
        <View style={[styles.listItem, style]}>
          <View style={styles.flexContainer}>
            {leftIcon}
            <StyledText
              type="title"
              variant="medium"
              style={{ alignItems: "center" }}
            >
              {children}
            </StyledText>
          </View>

          {rightIcon && (
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
            />
          )}
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  listItem: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  flexContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
});

export default AppListItem;
