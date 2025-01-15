import {
  Image,
  StatusBar,
  View,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import Screen from "./Screen";
import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LayeredScreen = ({
  children,
  backgroundColor,
  headerImageUrl,
  opacity,
  overlay = false,
  headerText,
  refreshing = false,
  onRefresh,
  ...props
}) => {
  const navigation = useNavigation();
  const statusBarHeight = StatusBar.currentHeight;
  const HEADER_HEIGHT = Platform.OS === "ios" ? 240 : 200;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Header as an absolute component */}
      <View style={[styles.imageContainer, { height: HEADER_HEIGHT }]}>
        <ImageBackground
          source={
            headerImageUrl && headerImageUrl !== null
              ? headerImageUrl
              : require("../../assets/images/layer.png")
          }
          style={styles.imageBg}
        >
          {overlay ? (
            <View
              style={[
                styles.overlay,
                { paddingTop: statusBarHeight, paddingBottom: 15 },
              ]}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                color={Colors.white}
                size={35}
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              />
              <StyledText
                color={Colors.white}
                type="heading"
                variant="semibold"
                style={{ textAlign: "center" }}
              >
                {headerText}
              </StyledText>
            </View>
          ) : (
            <View>
              {headerText && (
                <Image
                  source={require("../../assets/images/logo_white.png")}
                  style={{ alignSelf: "center", height: 60, width: 60 }}
                />
              )}
              <StyledText
                color={Colors.white}
                type="heading"
                variant="semibold"
                style={{ textAlign: "center", paddingBottom: 10 }}
              >
                {headerText}
              </StyledText>
            </View>
          )}
        </ImageBackground>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  backButton: {
    left: 20,
    top: 50,
    // position: "absolute",
  },
  imageBg: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    // paddingBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    flex: 1,
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 240 : 200, // Match HEADER_HEIGHT
    paddingBottom: 20,
  },
});

export default LayeredScreen;
