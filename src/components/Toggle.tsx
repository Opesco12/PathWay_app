import { View, StyleSheet } from "react-native";
import { useState } from "react";

import FilterBox from "./FilterBox";
import { Colors } from "@/src/constants/Colors";

const Toggle = ({ options, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const handlePress = (value) => {
    setSelectedValue(value);
    onValueChange(value);
  };
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <FilterBox
          key={index}
          text={option.label}
          selected={option.value === selectedValue}
          style={{
            backgroundColor:
              selectedValue === option.value ? Colors.primary : Colors.white,
          }}
          onPress={() => handlePress(option.value)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginVertical: 15,
  },
});

export default Toggle;
