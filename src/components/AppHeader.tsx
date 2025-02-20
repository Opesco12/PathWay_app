import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import { ArrowLeft2 } from "iconsax-react-native";

const AppHeader = () => {
  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {router.canGoBack() ? (
        <MaterialCommunityIcons
          name="chevron-left"
          size={35}
          onPress={() => router.back()}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-left"
          size={35}
          style={{ opacity: 0 }}
        />
      )}

      <MaterialCommunityIcons
        name="chevron-left"
        size={35}
        style={{ opacity: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
});

export default AppHeader;
