import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";

import { resetPassword, resetPasswordRequest } from "@/src/api";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),

    password: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters")
          .matches(
            /^[A-Za-z\d@$!%*?#&]+$/,
            "Password can only contain letters, numbers, and @$!%*#?&"
          )
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter"
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
          )
          .matches(/\d/, "Password must contain at least one number")
          .matches(
            /[@$!%*?&#]/,
            "Password must contain at least one special character (@$!%*?&#)"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    confirmPassword: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) =>
        schema
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    token: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) => schema.required("Please input the token in your mail"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginTop: 25 }}
      >
        Reset Password
      </StyledText>
      <StyledText
        color={Colors.light}
        type="body"
        variant="medium"
      >
        A Password reset email will be sent to your mail
      </StyledText>

      <View style={{ marginTop: 20 }}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: "",
            token: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={async (values) => {
            const { email, password, token } = values;
            console.log("Got here");
            setLoading(true);
            if (isEmailRegistered === true) {
              const response = await resetPassword(token, password);
              if (response) {
                showMessage({
                  message: "Password Reset Succesful",
                  type: "success",
                });
                router.replace("/(auth)/login");
              }
            } else {
              const response = await resetPasswordRequest(email);
              if (response) setIsEmailRegistered(true);
              console.log(response);
            }
            setLoading(false);
          }}
        >
          {({ handleChange, handleSubmit }) => (
            <>
              <AppTextField
                name={"email"}
                onChangeText={handleChange("email")}
                autoCapitalize={false}
                label={"Email"}
                readonly={isEmailRegistered && true}
              />
              {isEmailRegistered && (
                <>
                  <AppTextField
                    name={"token"}
                    onChangeText={handleChange("token")}
                    autoCapitalize={false}
                    label={"Token"}
                  />
                  <AppTextField
                    name={"password"}
                    onChangeText={handleChange("password")}
                    autoCapitalize={false}
                    label={"Password"}
                  />
                  <AppTextField
                    name={"confirmPassword"}
                    onChangeText={handleChange("confirmPassword")}
                    autoCapitalize={false}
                    label={"Confirm Password"}
                  />
                </>
              )}
              {isEmailRegistered ? (
                <AppButton
                  customStyles={{ marginTop: 20 }}
                  onPress={handleSubmit}
                >
                  {loading ? (
                    <ActivityIndicator
                      size={"small"}
                      color={Colors.white}
                    />
                  ) : (
                    "Reset Password"
                  )}
                </AppButton>
              ) : (
                <AppButton
                  customStyles={{ marginTop: 20 }}
                  onPress={handleSubmit}
                >
                  {loading ? (
                    <ActivityIndicator
                      size={"small"}
                      color={Colors.white}
                    />
                  ) : (
                    "Send Link"
                  )}
                </AppButton>
              )}
            </>
          )}
        </Formik>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

export default ResetPassword;
