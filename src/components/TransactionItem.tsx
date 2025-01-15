import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import AppDivider from "./AppDivider";

const TransactionItem = ({ transaction }) => {
  const transactionDate = new Date(transaction.valueDate).toDateString();
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/(app)/tranasaction-details",
          params: {
            transaction: JSON.stringify(transaction),
          },
        });
      }}
    >
      <View style={styles.container}>
        <View style={{ width: "70%" }}>
          <StyledText
            variant="medium"
            type="body"
            numberOfLines={1}
          >
            {transaction.description} {"-"} {transaction.portfolio}
          </StyledText>
          <StyledText
            type="label"
            color={Colors.light}
          >
            {transactionDate}
          </StyledText>
        </View>

        <StyledText
          variant="medium"
          type="body"
          style={{ width: "30%", textAlign: "right" }}
          numberOfLines={1}
        >
          {amountFormatter.format(transaction.amount)}
        </StyledText>
      </View>
      <AppDivider />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});

export default TransactionItem;
