import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { Camera, CloseCircle, Gallery } from "iconsax-react-native";
import * as ImagePicker from "expo-image-picker";
// import ImageView from "react-native-image-viewing";

import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import StyledText from "@/src/components/StyledText";
import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppModal from "@/src/components/AppModal";

const KYC_2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentImage, setDocumentImage] = useState({ uri: "" });
  const [visible, setIsVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const validationSchema = Yup.object().shape({});

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
      exif: false,
    });

    console.log(result);

    if (!result.canceled) {
      setDocumentImage({ uri: result.assets[0].uri });
    }
  };

  const images = [documentImage && documentImage];

  useEffect(() => {
    if (capturedImage !== null) {
      setDocumentImage({ uri: capturedImage });
    }
  }, [capturedImage]);

  return (
    <Screen>
      <AppHeader />
      <View style={{ marginTop: 20 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          KYC Details
        </StyledText>
        <StyledText
          type="body"
          variant="medium"
          color={Colors.light}
        >
          Step 2 of 2
        </StyledText>

        <Formik
          validationSchema={validationSchema}
          initialValues={{}}
          onSubmit={(values) => console.log(values)}
        >
          <View style={{ marginTop: 20 }}>
            <AppTextField
              label={"Contact Address"}
              name={"address"}
            />
            <AppTextField
              label={"City/Town"}
              name={"city"}
            />
            <AppTextField
              label={"State"}
              name={"state"}
            />

            <StyledText
              type="label"
              variant="medium"
              color={Colors.primary}
              style={{ marginBottom: 5 }}
            >
              Upload ID Document
            </StyledText>
            <AppButton
              customStyles={{
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: Colors.light,
              }}
              textColor={Colors.primary}
              onPress={() => setIsModalOpen(!isModalOpen)}
            >
              <AntDesign
                name="cloudupload"
                size={20}
                color={Colors.primary}
              />
              Upload File (JPG,PNG, PDF)
            </AppButton>
            {documentImage && documentImage.uri !== "" && (
              <View style={{ flexDirection: "row" }}>
                <TouchableWithoutFeedback
                  onPress={() => setIsVisible(true)}
                  style={{ flexDirection: "row", gap: 40 }}
                >
                  <Image
                    source={{ uri: documentImage && documentImage.uri }}
                    style={{
                      height: 50,
                      width: 50,
                      marginVertical: 10,
                      borderRadius: 10,
                    }}
                  />
                </TouchableWithoutFeedback>
              </View>
            )}

            <AppButton customStyles={{ marginTop: 30 }}>Submit</AppButton>
          </View>
        </Formik>
      </View>
      <AppModal
        isModalVisible={isModalOpen}
        setIsModalVisible={setIsModalOpen}
        modalHeight={200}
      >
        <View style={{ paddingVertical: 20, gap: 15 }}>
          <TouchableOpacity
            style={styles.modalList}
            onPress={() => {
              // router.push("/camera-screen");
              setIsCameraActive(true);
              setIsModalOpen(false);
            }}
          >
            <Camera
              size={25}
              color={Colors.primary}
            />
            <StyledText
              variant="medium"
              type="title"
            >
              Capture Image
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalList}
            onPress={() => {
              setIsModalOpen(false);
              pickImage();
            }}
          >
            <Gallery
              size={25}
              color={Colors.primary}
            />
            <StyledText
              variant="medium"
              type="title"
            >
              Select from Gallery
            </StyledText>
          </TouchableOpacity>
        </View>
      </AppModal>

      <AppModal
        modalHeight={"95%"}
        isModalVisible={isCameraActive}
        setIsModalVisible={setIsCameraActive}
        style={{ paddingHorizontal: 0, paddingVertical: 0 }}
      >
        <KYCDocumentCapture
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
          setIsCameraModalVisible={setIsCameraActive}
        />
      </AppModal>

      {/* <ImageView
        images={images}
        imageIndex={documentImage.uri !== "" && 0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      /> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  modalList: {
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});

export default KYC_2;
