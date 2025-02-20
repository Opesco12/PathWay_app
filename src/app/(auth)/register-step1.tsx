import { View } from "react-native";
import { useState } from "react";
import { Formik } from "formik";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

import Screen from "@/src/components/Screen";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppPicker from "@/src/components/AppPicker";
import AppDatePicker from "@/src/components/AppDatePicker";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";

import { Colors } from "@/src/constants/Colors";
import { userRegisterSchema1 } from "../../validationSchemas/userSchema";
import { formatDate } from "../../helperFunctions/formatDate";

const RegisterStep1 = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [DOB, setDOB] = useState(null);
  const [gender, setGender] = useState(null);

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  return (
    <Screen>
      {router.canGoBack() && <AppHeader />}
      <StyledText
        type="heading"
        variant="semibold"
      >
        Hello, It's nice to meet you
      </StyledText>

      <StyledText
        color={Colors.light}
        type="body"
        variant="medium"
      >
        Sign up for an account below
      </StyledText>

      <Formik
        validationSchema={userRegisterSchema1}
        initialValues={{
          firstname: "",
          lastname: "",
          phoneNumber: "",
          email: "",
        }}
        onSubmit={(values) => {
          if (DOB === null || gender === null) {
            showMessage({
              message: "Please fill out all fields",
              type: "warning",
            });
          } else {
            router.push({
              pathname: "/(auth)/register-step2",
              params: { ...values, gender, DOB },
            });
          }
        }}
      >
        {({ handleChange, handleSubmit }) => (
          <View style={{ marginTop: 20 }}>
            <AppTextField
              onChangeText={handleChange("firstname")}
              name="firstname"
              label="First Name"
            />
            <AppTextField
              onChangeText={handleChange("lastname")}
              name="lastname"
              label="Last Name"
            />
            <AppTextField
              onChangeText={handleChange("phoneNumber")}
              name="phoneNumber"
              label="Phone Number"
            />
            <AppTextField
              onChangeText={handleChange("email")}
              name="email"
              label="Email Address"
            />

            <>
              <StyledText
                type="label"
                variant="medium"
                color={Colors.primary}
              >
                Date of Birth
              </StyledText>

              <AppButton
                onPress={() => setDatePickerVisibility(true)}
                customStyles={{
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderColor: Colors.light,
                  marginTop: 10,
                }}
                textColor={Colors.primary}
              >
                {DOB ? formatDate(DOB) : "Select Date of Birth"}
              </AppButton>
            </>

            <AppPicker
              label="Gender"
              options={genderOptions}
              placeholder="Select Gender"
              onValueChange={(value) => setGender(value)}
              value={gender}
              style={{ marginTop: 10 }}
            />

            <AppButton
              onPress={handleSubmit}
              customStyles={{ marginTop: 30 }}
            >
              Next
            </AppButton>
          </View>
        )}
      </Formik>

      <AppDatePicker
        isDatePickerVisible={isDatePickerVisible}
        setDatePickerVisibility={setDatePickerVisibility}
        setDate={setDOB}
      />
    </Screen>
  );
};

export default RegisterStep1;
