import { ActivityIndicator, Image, View, Dimensions } from "react-native";
import { useState } from "react";
import { Formik } from "formik";
import { Icon } from "@rneui/base";
import { router } from "expo-router";

import { Colors } from "@/src/constants/Colors";
import AppButton from "@/src/components/AppButton";
import Screen from "@/src/components/Screen";
import AppTextField from "@/src/components/AppTextField";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";

import { userLoginSchema } from "../../validationSchemas/userSchema";
import { login } from "@/src/api";

const deviceWidth = Dimensions.get("window").width;

const Login = () => {
  const [email, setEmail] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <Screen>
      {router.canGoBack() && <AppHeader />}
      <View style={{ flex: 1 }}>
        <Image
          source={require("@/assets/images/login_image.png")}
          style={{
            height: 400,
            width: deviceWidth - 40,
            marginTop: 35,
            borderRadius: 12,
          }}
        />
        <StyledText
          type="heading"
          variant="semibold"
          style={{ marginTop: 15 }}
        >
          Welcome Back!
        </StyledText>
        <StyledText
          type="title"
          variant="medium"
          color={Colors.light}
        >
          Login to your account
        </StyledText>

        <Formik
          validationSchema={userLoginSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const { email, password } = values;
            setEmail(email);
            const response = await login(email, password);
            if (response) {
              setSubmitting(false);
              resetForm();
              router.replace({
                pathname: "/otp",
                params: { username: email },
              });
            } else {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit, handleChange, isSubmitting }) => (
            <View style={{ marginTop: 20, flex: 1 }}>
              <AppTextField
                label={"Username"}
                name="email"
                onChangeText={handleChange("email")}
                autoCapitalize="none"
              />
              <AppTextField
                label={"Password"}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    color={Colors.light}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                }
                name={"password"}
                onChangeText={handleChange("password")}
                secureTextEntry={hidePassword ? true : false}
              />
              <StyledText
                color={Colors.primary}
                style={{
                  textAlign: "right",
                  textDecorationLine: "underline",
                  marginVertical: 10,
                }}
                onPress={() => {
                  router.push("/reset-password");
                }}
              >
                Forgot Password?
              </StyledText>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <AppButton
                  onPress={handleSubmit}
                  customStyles={{ marginTop: 10 }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size={"small"} />
                  ) : (
                    "Login"
                  )}
                </AppButton>
                <StyledText
                  style={{ textAlign: "center", marginVertical: 15 }}
                  type="body"
                  variant="medium"
                >
                  Don't have an account?{" "}
                  <StyledText
                    color={Colors.secondary}
                    onPress={() => router.push("/register")}
                  >
                    Register
                  </StyledText>
                </StyledText>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </Screen>
  );
};

export default Login;
