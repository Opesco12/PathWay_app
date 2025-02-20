import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Colors } from "../constants/Colors";
import StyledText from "./StyledText";

const CenterModal = ({
  children,
  isVisible = false,
  onClose,
  title,
  buttons = true,
  primaryButtonText = "Save changes",
  secondaryButtonText = "Close",
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    handleClose();
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.backdrop}>
          <Pressable
            style={styles.backdropPressable}
            onPress={handleClose}
          />
        </View>

        <View style={styles.modalContent}>
          <View style={styles.header}>
            <StyledText
              variant="semibold"
              type="title"
            >
              {title}
            </StyledText>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>{children}</View>

          {buttons && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSecondaryPress}
              >
                <StyledText variant="medium">{secondaryButtonText}</StyledText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handlePrimaryPress}
              >
                <StyledText
                  color={Colors.white}
                  variant="medium"
                >
                  {primaryButtonText}
                </StyledText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    opacity: 0.5,
  },
  backdropPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: Dimensions.get("window").width * 0.9,
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeIcon: {
    fontSize: 20,
    color: "#6b7280",
    padding: 4,
  },
  body: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});

export default CenterModal;
