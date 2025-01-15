import { View } from "react-native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { router, useLocalSearchParams } from "expo-router";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";
import Otp_Input from "@/src/components/Otp_Input";
import StyledText from "@/src/components/StyledText";

import { storeUserData } from "@/src/storage/userData";
import { obfuscateEmail } from "../../helperFunctions/obfuscateEmail";
import { activateAccount, login2fa, resnedActivationCode } from "@/src/api";

const Otp = ({}) => {
  const { username, header } = useLocalSearchParams();
  const [code, setCode] = useState(Array(6).fill(""));
  const [isIncorrect, setIsIncorrect] = useState(false);

  const shortenedEmail = username && obfuscateEmail(username);

  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginTop: 25 }}
      >
        {header ? header : "OTP Verification"}
      </StyledText>
      <StyledText
        type="body"
        variant="medium"
        color={Colors.light}
      >
        We have sent a security code to your email address {shortenedEmail}{" "}
        Enter the code below to verify
      </StyledText>
      <View style={{ marginTop: 25, flex: 1 }}>
        <Otp_Input
          code={code}
          setCode={setCode}
          isIncorrect={isIncorrect}
        />

        {header && (
          <View style={{ marginTop: 25, marginBottom: 50 }}>
            <StyledText
              type="body"
              variant="medium"
              style={{ textAlign: "center" }}
            >
              Didn't receive a code?
            </StyledText>
            <StyledText
              color={Colors.lightPrimary}
              type="body"
              variant="medium"
              style={{
                marginTop: 10,
                textAlign: "center",
              }}
              onPress={async () => {
                const data = { userName: username };
                const response = await resnedActivationCode(data);
                if (response) {
                  showMessage({
                    message: "Security code has been sent to your email",
                    type: "success",
                  });
                }
              }}
            >
              Resend Security Code
            </StyledText>
          </View>
        )}

        <AppButton
          onPress={async () => {
            if (header) {
              const data = {
                username: username,
                securityCode: `${code.join("")}`,
              };

              const response = await activateAccount(data);
              if (response) {
                showMessage({
                  message: "Login Succesful",
                  type: "success",
                });
                router.replace("/login");
              } else {
                setIsIncorrect(true);
              }
            } else {
              const data = {
                username: username,
                securityCode: `${code.join("")}`,
              };

              const response = await login2fa(data);
              if (response) {
                showMessage({
                  message: "Login Succesful",
                  type: "success",
                });
                console.log(response);
                storeUserData(response);
                router.replace("/(tabs)/");
              } else {
                setIsIncorrect(true);
              }
            }
          }}
          customStyles={{
            display: code.join("").length < 6 ? "none" : "flex",
            marginTop: 50,
          }}
        >
          Continue
        </AppButton>
      </View>
    </Screen>
  );
};

export default Otp;
