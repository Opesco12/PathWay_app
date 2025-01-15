import { StyleSheet, View, StatusBar, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Icon } from "@rneui/themed";
import { Formik } from "formik";

import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import AppDatePicker from "@/src/components/AppDatePicker";
import AppPicker from "@/src/components/AppPicker";
import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";

import { registerNewIndividual, getCountries } from "../../api/index";
import { userRegisterSchema } from "../../validationSchemas/userSchema";
import { formatDate } from "../../helperFunctions/formatDate";

const Register = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [DOB, setDOB] = useState(null);
  const [gender, setGender] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [countries, setCountries] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);
  const statusBarHeight = StatusBar.currentHeight;

  const genderOptions = [
    {
      label: "Male",
      value: "M",
    },
    { label: "Female", value: "F" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();

      if (countries) {
        setCountries(
          countries.map((country) => ({
            label: country.name,
            value: country.code,
          }))
        );
      }
    };

    fetchData();
  }, []);

  return (
    <Screen>
      {/* <AppHeader /> */}

      <View style={{ marginTop: 20 }}>
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
          validationSchema={userRegisterSchema}
          initialValues={{
            firstname: "",
            lastname: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: "",
            city: "",
            state: "",
            clientType: 1,
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const {
              firstname,
              lastname,
              password,
              phoneNumber,
              address,
              email,
              city,
              state,
              clientType,
            } = values;

            const data = {
              dateOfBirth: DOB?.toISOString(),
              emailAddress: email,
              password: password,
              firstName: firstname,
              lastName: lastname,
              phoneNo: phoneNumber,
              clientType: clientType,
              gender: gender,
              address1: address,
              city: city,
              state: state,
              country: userCountry,
            };

            const response = await registerNewIndividual(data);
            if (response) {
              setSubmitting(false);
              showMessage({
                message: "You have successfully created an account",
                type: "success",
              });
              router.replace({
                pathname: "/(auth)/otp",
                params: {
                  username: email,
                  header: "Activate Account",
                },
              });
            }
            setSubmitting(false);
          }}
        >
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <View style={{ marginTop: 20 }}>
              <AppTextField
                onChangeText={handleChange("firstname")}
                name="firstname"
                label={"First Name"}
              />
              <AppTextField
                onChangeText={handleChange("lastname")}
                name="lastname"
                label={"Last Name"}
              />
              <AppTextField
                onChangeText={handleChange("phoneNumber")}
                name="phoneNumber"
                label={"Phone Number"}
              />
              <AppTextField
                onChangeText={handleChange("email")}
                name="email"
                label={"Email Address"}
              />

              <AppPicker
                label={"Gender"}
                options={genderOptions}
                placeholder={"select Gender"}
                onValueChange={(value) => setGender(value)}
                value={gender}
              />

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
                {DOB !== null ? formatDate(DOB) : "Select Date of Birth"}
              </AppButton>

              <AppTextField
                name={"address"}
                onChangeText={handleChange("address")}
                label={"Address"}
              />
              <AppTextField
                name={"city"}
                onChangeText={handleChange("city")}
                label={"City"}
              />
              <AppTextField
                name={"state"}
                onChangeText={handleChange("state")}
                label={"State"}
              />

              <AppPicker
                label={"Country"}
                options={countries}
                placeholder={"select Country"}
                onValueChange={(value) => setUserCountry(value)}
                value={userCountry}
              />

              <AppTextField
                onChangeText={handleChange("password")}
                name={"password"}
                label={"Password"}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setHidePassword(!hidePassword)}
                    color={Colors.light}
                  />
                }
                secureTextEntry={hidePassword ? true : false}
              />

              <AppTextField
                onChangeText={handleChange("confirmPassword")}
                name="confirmPassword"
                label={"Confirm Password"}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setHidePassword(!hidePassword)}
                    color={Colors.light}
                  />
                }
                secureTextEntry={hidePassword ? true : false}
              />

              <StyledText
                color={Colors.light}
                style={{ textAlign: "center", marginVertical: 20 }}
              >
                By Signing up, you agree to{" "}
                <StyledText color={Colors.primary}>
                  Terms of Use and Privacy Policy
                </StyledText>
              </StyledText>

              <AppButton
                onPress={() => {
                  if (userCountry === null || gender === null || DOB === null) {
                    showMessage({
                      message: "Please fill out all fields",
                      type: "warning",
                    });
                  }
                  handleSubmit();
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    size={"small"}
                    color={Colors.white}
                  />
                ) : (
                  "Proceed"
                )}
              </AppButton>

              <StyledText style={{ marginVertical: 20, textAlign: "center" }}>
                Already have an account?{" "}
                <StyledText
                  color={Colors.secondary}
                  onPress={() => router.replace("/(auth)/login")}
                >
                  Login
                </StyledText>
              </StyledText>
            </View>
          )}
        </Formik>
      </View>
      <AppDatePicker
        isDatePickerVisible={isDatePickerVisible}
        setDatePickerVisibility={setDatePickerVisibility}
        setDate={setDOB}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export default Register;
