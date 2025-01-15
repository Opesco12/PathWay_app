import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const NumberPad = () => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (value) => {
    setInputValue((prevValue) => prevValue + value);
  };

  const handleBackspace = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>{inputValue}</Text>
      </View>
      <View style={styles.keyboardContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.keyContainer}
            onPress={() => handleKeyPress(num.toString())}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.keyContainer, styles.backspaceContainer]}
          onPress={handleBackspace}
        >
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  inputText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  keyboardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  keyContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 8,
  },
  backspaceContainer: {
    backgroundColor: "#f2f2f2",
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default NumberPad;
