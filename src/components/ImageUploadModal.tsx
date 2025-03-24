import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

const ProfileImageUploadModal = ({
  isVisible,
  onClose,
  onUpload,
  selectedImage,
  setSelectedImage,
}) => {
  // const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickImage = async () => {
    // Request permission and pick an image
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("You need to allow Camera roll permission for upload to work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result?.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      // Implement your upload logic here
      await onUpload(selectedImage);
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      showMessage({
        message: "Upload failed. Please try again.",
        type: "warning",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    // Reset selected image when closing
    setSelectedImage(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Upload Profile Image</Text>

              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handlePickImage}
              >
                <StyledText style={styles.imagePickerText}>
                  Choose Image
                </StyledText>
              </TouchableOpacity>

              {selectedImage && (
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.previewImage}
                  />
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  (isUploading || !selectedImage) && styles.disabledButton,
                ]}
                onPress={handleUpload}
                disabled={isUploading || !selectedImage}
              >
                {isUploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <StyledText color={Colors.white}>Upload Photo</StyledText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <StyledText style={styles.cancelButtonText}>Cancel</StyledText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 35,
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#000050",
    textAlign: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  uploadButton: {
    backgroundColor: "#000050",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#60C2CF",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000050",
  },
});

export default ProfileImageUploadModal;
