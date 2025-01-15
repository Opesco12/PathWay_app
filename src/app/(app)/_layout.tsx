import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "ios_from_right" }}
    />
  );
};

export default AppLayout;
