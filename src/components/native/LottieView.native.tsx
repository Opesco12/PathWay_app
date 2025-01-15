import { Platform } from "react-native";

let LottieView;

if (Platform.OS === "ios" || Platform.OS === "android") {
  LottieView = require("lottie-react-native");
}

export default LottieView;
