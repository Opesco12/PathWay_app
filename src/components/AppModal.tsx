import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import ReactNativeModal from "react-native-modal";

import { Colors } from "@/src/constants/Colors";

const AppModal = ({
  children,
  isModalVisible,
  setIsModalVisible,
  modalHeight,
  style,
}) => {
  return (
    <ReactNativeModal
      isVisible={isModalVisible}
      style={styles.modal}
      swipeThreshold={60}
      swipeDirection={"down"}
      onBackdropPress={() => setIsModalVisible(false)}
      onSwipeComplete={() => setIsModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={{ marginBottom: 0 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View
          style={[
            styles.modalContent,
            {
              minHeight: modalHeight ? modalHeight : 300,
            },
            style,
          ]}
        >
          <View style={styles.line}></View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    overflow: "hidden",
  },
  line: {
    alignSelf: "center",
    backgroundColor: Colors.black,
    borderRadius: 3,
    opacity: 0.4,
    height: 5,
    width: 50,
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
  text: {
    fontSize: 16,
  },
});

export default AppModal;
