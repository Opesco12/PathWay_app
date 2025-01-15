import {
  Image,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import { Formik } from "formik";

import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppDivider from "@/src/components/AppDivider";
import AppPicker from "@/src/components/AppPicker";
import AppButton from "@/src/components/AppButton";

import { userProfileSchema } from "../../validationSchemas/userSchema";
import { retrieveUserData } from "@/src/storage/userData";
import { createNextOfKin, getClientInfo, getNextOfKins } from "@/src/api";

const PersonalDetails = () => {
  const [storedData, setStoredData] = useState(null);
  const [userHasNextOfKin, setUserHasNextOfKin] = useState(0);
  const [userData, setUserData] = useState(null);
  const [nexOfKin, setNextOfKin] = useState(null);
  const [kinRelationship, setKinRelationship] = useState(null);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();
      setStoredData(data);

      const clientInfo = await getClientInfo();
      const { firstname, surname, mobileNumber } = clientInfo;
      setUserData({
        firstname: firstname,
        surname: surname,
        mobileNumber: mobileNumber,
      });

      const nextOfKins = await getNextOfKins();
      if (nextOfKins.length > 0) {
        setUserHasNextOfKin(1);
        setNextOfKin(nextOfKins[0]);
        setKinRelationship(nextOfKins[0].relationship);
        setGender(nextOfKins[0].gender);
      }
    };

    fetchData();
  }, []);

  const kinRelationships = [
    {
      label: "Spouse",
      value: "Spouse",
    },
    {
      label: "Parent",
      value: "Parent",
    },
    {
      label: "Sibling",
      value: "Sibling",
    },
    {
      label: "Son",
      value: "Son",
    },
    {
      label: "Daughter",
      value: "Daughter",
    },
    {
      label: "Guardian",
      value: "Guardian",
    },
    {
      label: "Aunt",
      value: "Aunt",
    },
    {
      label: "Uncle",
      value: "Uncle",
    },
    {
      label: "Niece",
      value: "Niece",
    },
    {
      label: "Nephew",
      value: "Nephew",
    },
    {
      label: "Cousin",
      value: "Cousin",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  const genderOptions = [
    {
      label: "Male",
      value: "M",
    },
    { label: "Female", value: "F" },
  ];

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <AppHeader />

        <View
          style={{
            marginVertical: 25,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <StyledText
              type="heading"
              variant="semibold"
            >
              Personal Details
            </StyledText>
            <StyledText color={Colors.light}>{storedData?.fullName}</StyledText>
          </View>

          <Image
            source={require("../../../assets/images/layer.png")}
            style={{ height: 50, width: 50, borderRadius: 25 }}
          />
        </View>
        {!userData ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator
              size={"large"}
              color={Colors.primary}
            />
          </View>
        ) : (
          <View>
            <Formik
              validationSchema={userProfileSchema}
              initialValues={
                userHasNextOfKin > 0
                  ? {
                      firstname: userData.firstname,
                      surname: userData.surname,
                      phoneNumber: userData.mobileNumber,
                      kinFirstname: nexOfKin ? nexOfKin?.firstname : "",
                      kinLastname: nexOfKin ? nexOfKin?.surname : "",
                      kinEmail: nexOfKin ? nexOfKin?.email : "",
                      kinPhoneNumber: nexOfKin ? nexOfKin?.telephoneNo : "",
                    }
                  : {
                      firstname: userData.firstname,
                      surname: userData.surname,
                      phoneNumber: userData.mobileNumber,
                      kinFirstname: "",
                      kinLastname: "",
                      kinEmail: "",
                      kinPhoneNumber: "",
                    }
              }
              onSubmit={async (values) => {
                const { kinEmail, kinFirstname, kinLastname, kinPhoneNumber } =
                  values;

                const nextOfKinData = {
                  email: kinEmail,
                  firstname: kinFirstname,
                  surname: kinLastname,
                  telephoneNo: kinPhoneNumber,
                  relationship: kinRelationship,
                  gender: gender,
                };
                if (userHasNextOfKin === 0) {
                  const data = await createNextOfKin(nextOfKinData);
                  if (data) {
                    showMessage({
                      message: "Profile has been updated succesfully",
                      type: "success",
                    });
                    router.replace("/(tabs)/profile");
                  }
                }
              }}
            >
              {({ handleChange, handleSubmit, isSubmitting }) => (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <AppTextField
                      name={"firstname"}
                      label={"Full name"}
                      onChangeText={handleChange("firstname")}
                      width={"48%"}
                      value={userData && userData?.firstname}
                      readonly
                    />
                    <AppTextField
                      name={"surname"}
                      onChangeText={handleChange("surname")}
                      width={"48%"}
                      rightLabel={"-Update your full name"}
                      rightLabelColor={Colors.light}
                      readonly
                    />
                  </View>
                  <AppTextField
                    name={"phoneNumber"}
                    onChangeText={handleChange("phoneNumber")}
                    label={"Phone Number"}
                    rightLabel={"-Update your phone number"}
                    rightLabelColor={Colors.light}
                    readonly
                  />

                  <StyledText
                    type="subheading"
                    variant="medium"
                    style={{ marginTop: 20 }}
                  >
                    Next Of Kin
                  </StyledText>
                  <AppDivider style={{ marginBottom: 20 }} />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <AppTextField
                      name={"kinFirstname"}
                      label={"Full name"}
                      onChangeText={handleChange("kinFirstname")}
                      width={"48%"}
                      readonly={userHasNextOfKin === 1 ? true : false}
                    />
                    <AppTextField
                      name={"kinLastname"}
                      onChangeText={handleChange("kinLastname")}
                      width={"48%"}
                      rightLabel={"-Update next of kin's full name"}
                      rightLabelColor={Colors.light}
                      readonly={userHasNextOfKin === 1 ? true : false}
                    />
                  </View>

                  <AppTextField
                    name={"kinEmail"}
                    onChangeText={handleChange("kinEmail")}
                    label={"Email Address"}
                    rightLabel={"-Update next of kin's email address"}
                    rightLabelColor={Colors.light}
                    readonly={userHasNextOfKin === 1 ? true : false}
                  />
                  <AppTextField
                    name={"kinPhoneNumber"}
                    onChangeText={handleChange("kinPhoneNumber")}
                    label={"Phone Number"}
                    rightLabel={"-Update next of kin's full name"}
                    rightLabelColor={Colors.light}
                    readonly={userHasNextOfKin === 1 ? true : false}
                  />

                  <AppPicker
                    label={"Relationship"}
                    placeholder={"Select Relationship with next of kin"}
                    rightLabel={"-How are you related?"}
                    rightLabelColor={Colors.light}
                    options={kinRelationships}
                    onValueChange={(value) => setKinRelationship(value)}
                    value={kinRelationship}
                    clickable={userHasNextOfKin === 1 ? false : true}
                  />
                  <AppPicker
                    label={"Gender"}
                    placeholder={"Select Gender"}
                    rightLabel={"-How do they identify?"}
                    rightLabelColor={Colors.light}
                    options={genderOptions}
                    onValueChange={(value) => setGender(value)}
                    value={gender}
                    clickable={userHasNextOfKin === 1 ? false : true}
                  />

                  <AppButton
                    customStyles={{ marginVertical: 40 }}
                    onPress={() => {
                      if (gender && kinRelationship) {
                        handleSubmit();
                      } else {
                        showMessage({
                          message: "Please fill out all fields",
                          type: "warning",
                        });
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.white}
                      />
                    ) : (
                      "Save"
                    )}
                  </AppButton>
                </>
              )}
            </Formik>
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default PersonalDetails;
