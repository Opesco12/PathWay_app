import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { WebView } from "react-native-webview";
import { Message2 } from "iconsax-react-native";
import { Colors } from "../constants/Colors";

import { useChat } from "../context/ChatContext";

const { height, width } = Dimensions.get("window");

const TawkToChat = () => {
  const { isModalVisible, toggleModal, closeModal } = useChat();

  return (
    <View>
      {/* Floating Button */}
      <TouchableOpacity
        onPress={toggleModal}
        style={styles.floatingButton}
      >
        <Message2
          size={30}
          color={Colors.white}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <WebView
              source={{
                uri: "https://tawk.to/chat/679378b13a842732607466da/1iic0uu3e",
              }}
              style={{ flex: 1 }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn("WebView error: ", nativeEvent);
              }}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              scrollEnabled={false}
              bounces={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 85,
    right: 20,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.75,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
  },
});

export default TawkToChat;
