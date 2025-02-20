import React, { useRef } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Colors } from "@/src/constants/Colors";

const Otp_Input = ({
  codeLength = 6,
  onCodeFilled,
  code,
  setCode,
  isIncorrect,
}) => {
  const inputRefs = useRef([]);

  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent) {
        const validPastedData = clipboardContent
          .replace(/[^0-9]/g, "") // Remove non-numeric characters
          .slice(0, codeLength);

        if (validPastedData.length === codeLength) {
          setCode(validPastedData.split(""));

          // Notify that the code is filled
          onCodeFilled && onCodeFilled(validPastedData);
        } else {
          Alert.alert("Invalid Code", "The pasted code is not valid.");
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      onCodeFilled && onCodeFilled(newCode.join(""));
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleLongPress = () => {
    Alert.alert("Paste Code", "Do you want to paste the code from clipboard?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Paste", onPress: handlePaste },
    ]);
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            { borderColor: isIncorrect ? Colors.error : Colors.light },
          ]}
          maxLength={1}
          keyboardType="numeric"
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          onPressIn={index === 0 ? handleLongPress : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 20,
    height: 43,
    textAlign: "center",
    width: 43,
  },
});

export default Otp_Input;
