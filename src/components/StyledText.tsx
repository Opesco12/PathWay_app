import { StyleSheet, Text, View, } from "react-native";

const StyledText = ({
  color,
  children,
  type = "body",
  variant = "regular",
 
  style,numberOfLines, ellipsizeMode ,
  ...props
}) => {
  const textStyle = [styles[type], styles[variant], style];

  return (
    <Text style={[textStyle, { color: color }]} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode} {...props}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    lineHeight: 36,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 30,
  },
  title: {
    fontSize: 17,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  regular: {
    fontFamily: "IBMRegular",
    fontWeight: "400",
  },
  medium: {
    fontFamily: "IBMMedium",
    fontWeight: "500",
  },
  semibold: {
    fontFamily: "IBMSemibold",
    fontWeight: "600",
  },
  bold: {
    fontFamily: "IBMBold",
    fontWeight: "700",
  },
});

export default StyledText;
