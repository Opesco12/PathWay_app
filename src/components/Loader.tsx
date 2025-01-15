import { View, ActivityIndicator } from "react-native";

import { Colors } from "../constants/Colors";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        size={"large"}
        color={Colors.lightPrimary}
      />
    </View>
  );
};

export default Loader;
