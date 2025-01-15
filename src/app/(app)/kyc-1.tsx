import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import { Camera, CloseCircle, Gallery } from "iconsax-react-native";
import * as ImagePicker from "expo-image-picker";
import ImageView from "react-native-image-viewing";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";
import * as Yup from "yup";

import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppPicker from "@/src/components/AppPicker";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import AppModal from "@/src/components/AppModal";
import AppDatePicker from "@/src/components/AppDatePicker";

import { retrieveUserData } from "@/src/storage/userData";
import { verifyDocuments } from "../../api/verification/index";
import { handleVerificationResponses } from "../../helperFunctions/verification";
import { formatDate } from "../../helperFunctions/formatDate";

const KYC_1 = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState(null);
  const [dob, setDob] = useState(null);
  const [documentImage, setDocumentImage] = useState({ uri: "" });
  const [visible, setIsVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const options = [
    {
      label: "International Passport",
      value: "International Passport",
    },
    { label: "Driver's License", value: "Driver's License" },
    { label: "Voter's Card", value: "Voter's Card" },
  ];

  const kycValidationSchema = Yup.object().shape({
    nin: Yup.string()
      .matches(/^\d{11}$/, "NIN must be exactly 11 digits")
      .required("NIN is required"),

    bvn: Yup.string()
      .matches(/^\d{11}$/, "BVN must be exactly 11 digits")
      .required("BVN is required"),

    documentNumber: Yup.string().when(() => {
      return documentType !== null
        ? Yup.string().required("Document Number is required")
        : Yup.string().notRequired();
    }),

    firstname: Yup.string().when(() => {
      return documentType !== null
        ? Yup.string().required("First Name is required")
        : Yup.string().notRequired();
    }),
    lastname: Yup.string().when(() => {
      return documentType !== null
        ? Yup.string().required("Last Name is required")
        : Yup.string().notRequired();
    }),
    voterLga: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("Local Goverment Area is required")
        : Yup.string().notRequired();
    }),
    voterState: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("State is required")
        : Yup.string().notRequired();
    }),
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
      base64: true,
    });

    setIsModalOpen(false);
    console.log(result);

    if (!result.canceled) {
      setDocumentImage({ uri: result.assets[0].uri });
    }
  };

  const images = [documentImage && documentImage];

  useEffect(() => {
    if (capturedImage !== null) {
      setDocumentImage({ uri: capturedImage });
      // setFieldValue("imageUri", capturedImage);
    }
  }, [capturedImage]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();
      const names = data.fullName.split(" ");
      setUserData({
        firstname: names[0],
        surname: names[1],
      });
    };

    fetchData();
  }, []);

  const takePhoto = async () => {
    setIsModalOpen(false);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      cameraType: ImagePicker.CameraType.back,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result);
    if (!result.canceled) {
      setCapturedImage(result && result.assets[0].uri);
    }
  };

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
          Step 1 of 2
        </StyledText>

        <Formik
          validationSchema={kycValidationSchema}
          initialValues={{
            nin: "",
            bvn: "",
            documentNumber: "",
            firstname: "",
            lastname: "",
            voterLga: "",
            voterState: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            setVerifying(true);
            console.log(values);
            const {
              bvn,
              nin,
              firstname,
              lastname,
              voterLga,
              documentNumber,
              voterState,
            } = values;

            console.log(values);

            const responses = await verifyDocuments({
              bvn: bvn,
              nin: nin,
              userData: userData,
            });

            // handleVerificationResponses(responses);
            setVerifying(false);
          }}
        >
          {({ handleChange, handleSubmit, errors, touched, setFieldValue }) => (
            <View style={{ marginTop: 20 }}>
              <AppTextField
                label={"National Identification Number"}
                name="nin"
                onChangeText={handleChange("nin")}
              />
              <AppTextField
                label={"Biometric Verification Number"}
                name="bvn"
                onChangeText={handleChange("bvn")}
              />

              <AppPicker
                label={"Government Issued Identification"}
                placeholder={"Select Document Type"}
                options={options}
                onValueChange={(value) => {
                  setDocumentType(value);
                  setFieldValue("selectedDocument", value);
                }}
                value={documentType}
              />

              {documentType && (
                <>
                  <AppTextField
                    label={"Document Number"}
                    name={"documentNumber"}
                    onChangeText={handleChange("documentNumber")}
                  />
                  <AppTextField
                    label={"First Name"}
                    name={"firstname"}
                    onChangeText={handleChange("firstname")}
                  />
                  <AppTextField
                    label={"Last Name"}
                    name={"lastname"}
                    onChangeText={handleChange("lastname")}
                  />
                  <StyledText
                    type="label"
                    variant="medium"
                    color={Colors.primary}
                    style={{ marginTop: 10 }}
                  >
                    Date of Birth
                  </StyledText>
                  <AppButton
                    onPress={() => setDatePickerVisibility(true)}
                    customStyles={{
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.light,
                      marginTop: 5,
                      marginBottom: 10,
                    }}
                    textColor={Colors.primary}
                  >
                    {dob !== null ? formatDate(dob) : "Select Date of Birth"}
                  </AppButton>
                </>
              )}

              {documentType && documentType === "Voter's Card" && (
                <>
                  <AppTextField
                    label={"State"}
                    name={"voterState"}
                    onChangeText={handleChange("voterState")}
                  />
                  <AppTextField
                    label={"Local Government Area"}
                    name={"voterLga"}
                    onChangeText={handleChange("voterLga")}
                  />
                </>
              )}
              {documentType && (
                <>
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
                    Upload File (JPG, PNG, PDF)
                  </AppButton>
                </>
              )}

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
              <AppButton
                onPress={() => {
                  if (documentType !== null && dob !== null) {
                    if (documentType !== "Voter's Card") {
                      handleSubmit();
                    } else if (documentType === "Voter's Card") {
                      handleSubmit();
                    } else {
                      showMessage({
                        message: `Please upload or take a picture of your ${documentType}`,
                        type: "warning",
                      });
                    }
                  } else {
                    showMessage({
                      message: "Please fill out all fields",
                      type: "warning",
                    });
                  }
                }}
                customStyles={{ marginTop: 30, marginBottom: 20 }}
              >
                Submit
              </AppButton>
            </View>
          )}
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
            onPress={takePhoto}
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
            onPress={pickImage}
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

      <ImageView
        images={images}
        imageIndex={documentImage.uri !== "" && 0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

      <AppDatePicker
        isDatePickerVisible={isDatePickerVisible}
        setDatePickerVisibility={setDatePickerVisibility}
        setDate={setDob}
      />

      {verifying && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <View
            style={{
              height: 250,
              width: 250,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              zIndex: 5,
            }}
          >
            <LottieView
              loop
              autoPlay
              source={require("../../../assets/animations/verifying.json")}
              style={{ height: 200, width: 200 }}
            />
          </View>
        </View>
      )}
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

export default KYC_1;
