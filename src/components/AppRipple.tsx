import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "@/src/constants/Colors";

const AppRipple = ({ children, style, onPress }) => {
  return (
    <TouchableRipple
      style={style}
      onPress={onPress}
      rippleColor={Colors.light}
    >
      <>{children}</>
    </TouchableRipple>
  );
};

export default AppRipple;
