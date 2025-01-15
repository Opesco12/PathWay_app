import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";
import ContentBox from "@/src/components/ContentBox";
import { amountFormatter } from "@/src/helperFunctions/amountFormatter";
import { Colors } from "@/src/constants/Colors";

const TransactionDetails = () => {
  const { transaction: transactionString } = useLocalSearchParams();
  const transaction = JSON.parse(transactionString);
  const date = new Date(transaction.valueDate).toDateString();

  console.log(transaction);
  return (
    <Screen customStyles={{ backgroundColor: Colors.lightBg }}>
      <AppHeader />

      <View style={{ marginTop: 25 }}>
        <ContentBox
          customStyles={{
            borderWidth: 0,
            backgroundColor: Colors.white,
            alignItems: "center",
          }}
        >
          <StyledText
            type="title"
            variant="medium"
          >
            {transaction.portfolio}
          </StyledText>
          <StyledText
            type="heading"
            variant="semibold"
            style={{ textAlign: "center", marginVertical: 20 }}
          >
            {amountFormatter.format(transaction.amount)}
          </StyledText>
          <StyledText
            type="title"
            style={{ textAlign: "center" }}
          >
            {transaction.description}
          </StyledText>
          <StyledText style={{ marginTop: 25 }}>Date: {date}</StyledText>
        </ContentBox>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default TransactionDetails;
