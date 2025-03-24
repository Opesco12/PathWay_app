import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Platform,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import * as Clipboard from "expo-clipboard";

import { Colors } from "@/src/constants/Colors";

const Otp_Input = ({
  codeLength = 6,
  onCodeFilled,
  code,
  setCode,
  isIncorrect,
  autoFocus = true,
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      handleDirectPaste(text);
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      onCodeFilled && onCodeFilled(newCode.join(""));
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleDirectPaste = (text) => {
    const pastedData = text.replace(/[^0-9]/g, "").slice(0, codeLength);

    if (pastedData) {
      const newCode = Array(codeLength).fill("");

      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }

      setCode(newCode);

      if (pastedData.length === codeLength) {
        onCodeFilled && onCodeFilled(pastedData);
        Keyboard.dismiss();
      } else if (pastedData.length > 0 && pastedData.length < codeLength) {
        inputRefs.current[pastedData.length].focus();
      }
    }
  };

  const handleAndroidPaste = (text) => {
    if (Platform.OS === "android") {
      handleDirectPaste(text);
    }
  };

  return (
    <View style={styles.container}>
      {Array(codeLength)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              { borderColor: isIncorrect ? Colors.error : Colors.light },
              code[index] ? styles.filledInput : {},
            ]}
            maxLength={Platform.OS === "android" ? codeLength : 1}
            keyboardType="numeric"
            value={code[index] || ""}
            onChangeText={(text) => {
              if (Platform.OS === "android" && text.length > 1) {
                handleAndroidPaste(text);
              } else {
                handleChange(text, index);
              }
            }}
            onKeyPress={(event) => handleKeyPress(event, index)}
            textContentType="oneTimeCode"
            selectionColor={Colors.primary}
            contextMenuHidden={false}
            onPaste={(event) => {
              if (Platform.OS === "ios" && event?.nativeEvent?.data) {
                handleDirectPaste(event.nativeEvent.data);
              }
            }}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    position: "relative",
    paddingVertical: 10,
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
  filledInput: {
    backgroundColor: "#f5f5f5",
  },
});

export default Otp_Input;
