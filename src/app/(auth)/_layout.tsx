import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StatusBar } from "react-native";

const AuthLayout = () => {
  return (
    <>
      <ExpoStatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, animation: "ios_from_right" }}
      >
        {/* <Stack.Screen name="login" /> */}
      </Stack>
    </>
  );
};

export default AuthLayout;
