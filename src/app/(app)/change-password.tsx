import { ActivityIndicator, View } from "react-native";
import { Formik } from "formik";
import { showMessage } from "react-native-flash-message";
import * as Yup from "yup";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";

import { changePasswordSchema } from "@/src/validationSchemas";
import { router } from "expo-router";
import { changePassword } from "@/src/api";
import { useState } from "react";

const ChangePassword = () => {
  const [isSubmitting, setSubmitting] = useState(false);

  const changeUserPassword = async (oldPassword, newPassword) => {
    const data = await changePassword(oldPassword, newPassword);
    if (data) {
      setTimeout(() => {
        showMessage({
          message: "Your password has been changed successfully",
          type: "success",
        });

        router.replace("/(tabs)/profile");
      }, 5000);
    }
  };

  return (
    <Screen>
      <AppHeader />
      <View style={{ marginVertical: 25 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Change Password
        </StyledText>
      </View>

      <View>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={(values, { resetForm }) => {
            setSubmitting(true);
            const { newPassword, oldPassword } = values;
            setTimeout(async () => {
              await changeUserPassword(oldPassword, newPassword);
            }, 2000);
            setSubmitting(false);
          }}
        >
          {({ handleChange, handleSubmit }) => (
            <>
              <AppTextField
                name={"oldPassword"}
                label={"Password"}
                onChangeText={handleChange("oldPassword")}
                secureTextEntry
              />
              <AppTextField
                name={"newPassword"}
                label={"New Password"}
                onChangeText={handleChange("newPassword")}
                secureTextEntry
              />
              <AppTextField
                name={"confirmPassword"}
                label={"Confirm Password"}
                onChangeText={handleChange("confirmPassword")}
                secureTextEntry
              />

              <AppButton
                customStyles={{ marginTop: 25 }}
                onPress={handleSubmit}
              >
                {isSubmitting === true ? (
                  <ActivityIndicator
                    size={"small"}
                    color={Colors.white}
                  />
                ) : (
                  "Change Password"
                )}
              </AppButton>
            </>
          )}
        </Formik>
      </View>
    </Screen>
  );
};

export default ChangePassword;
