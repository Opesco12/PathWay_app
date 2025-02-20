import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useLocalSearchParams, router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { Icon } from "@rneui/themed";

import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppPicker from "@/src/components/AppPicker";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";

import { Colors } from "@/src/constants/Colors";
import { registerNewIndividual, getCountries } from "../../api/index";
import { userRegisterSchema2 } from "../../validationSchemas/userSchema";

const RegisterStep2 = () => {
  const params = useLocalSearchParams();
  const [userCountry, setUserCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();
      setCountries(
        countries.map((country) => ({
          label: country.name,
          value: country.code,
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <Screen>
      {router.canGoBack() && <AppHeader />}
      <StyledText
        type="heading"
        variant="semibold"
      >
        Complete Your Registration
      </StyledText>

      <Formik
        validationSchema={userRegisterSchema2}
        initialValues={{
          address: "",
          city: "",
          state: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const data = {
            ...params,
            address1: values.address,
            city: values.city,
            state: values.state,
            country: userCountry,
            password: values.password,
          };

          const response = await registerNewIndividual(data);
          setSubmitting(false);

          if (response) {
            showMessage({
              message: "Account created successfully",
              type: "success",
            });
            router.replace({
              pathname: "/(auth)/otp",
              params: { username: params.email, header: "Activate Account" },
            });
          }
        }}
      >
        {({ handleChange, handleSubmit, isSubmitting }) => (
          <View style={{ marginTop: 20 }}>
            <AppTextField
              name="address"
              onChangeText={handleChange("address")}
              label="Address"
            />
            <AppTextField
              name="city"
              onChangeText={handleChange("city")}
              label="City"
            />
            <AppTextField
              name="state"
              onChangeText={handleChange("state")}
              label="State"
            />

            <AppPicker
              label="Country"
              options={countries}
              placeholder="Select Country"
              onValueChange={setUserCountry}
              value={userCountry}
            />

            <AppTextField
              onChangeText={handleChange("password")}
              name="password"
              label="Password"
              secureTextEntry={hidePassword}
              rightIcon={
                <Icon
                  type="material-community"
                  name={hidePassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
            />

            <AppTextField
              onChangeText={handleChange("confirmPassword")}
              name="confirmPassword"
              label="Confirm Password"
              secureTextEntry={hidePassword}
              rightIcon={
                <Icon
                  type="material-community"
                  name={hidePassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
            />

            <AppButton
              onPress={handleSubmit}
              customStyles={{ marginTop: 30 }}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.white}
                />
              ) : (
                "Proceed"
              )}
            </AppButton>
          </View>
        )}
      </Formik>
    </Screen>
  );
};

export default RegisterStep2;
