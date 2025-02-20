import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import { Pressable } from "react-native";

const Onboarding = () => {
  const handleLoginNavigation = () => {
    router.push("/(auth)/login");
  };

  const handleSignupNavigation = () => {
    router.push("/(auth)/register-step1");
  };
  return (
    <ImageBackground
      source={require("../../../assets/images/onboarding/onboarding.png")}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "flex-end",
          padding: 30,
          paddingVertical: 40,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={handleSignupNavigation}
          style={{
            width: "48%",
            borderWidth: 1,
            borderColor: Colors.white,
            height: 55,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <StyledText
              type="title"
              variant="medium"
              color={Colors.white}
            >
              Sign Up
            </StyledText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLoginNavigation}
          style={{
            width: "48%",
            borderWidth: 1,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderColor: Colors.white,
            height: 55,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <StyledText
              type="title"
              variant="medium"
              color={"rgba(255, 255, 255, 0.9)"}
            >
              Login
            </StyledText>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Onboarding;
