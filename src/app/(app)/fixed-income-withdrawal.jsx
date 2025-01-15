import { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Calendar,
  Clock,
  Money4,
  PercentageCircle,
} from "iconsax-react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { showMessage } from "react-native-flash-message";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

import LayeredScreen from "@/src/components/LayeredScreen";
import ContentBox from "@/src/components/ContentBox";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";
import { fixedIncomeRedemptionOrder } from "@/src/api";

const FixedIncomeWithdrawal = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    header,
    headerImageUrl,
    balance,
    investment: investmentString,
  } = useLocalSearchParams();
  const investment = JSON.parse(investmentString);

  const showWithdrawalAlert = async (accountNo, amount) => {
    Alert.alert(
      "Confirm Withdrawal",
      `Are you sure you want to withdraw ${amountFormatter.format(amount)}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Withdrawal cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => await handleWithdrawal(accountNo, amount),
        },
      ]
    );
  };

  const handleWithdrawal = async (referenceNo, amount) => {
    setSubmitting(true);
    const data = await fixedIncomeRedemptionOrder(referenceNo, amount);
    if (data) {
      setTimeout(() => {
        showMessage({
          position: "center",
          message: "Withdrawal Successful",
          description: `You have successfully withdrawn ₦${
            amount && amount
          } from ${header && header}`,
          style: {
            padding: 15,
          },
          textStyle: { fontSize: 18, textAlign: "center" },
          titleStyle: {
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
          },
          duration: 3000,
          renderCustomContent: () => (
            <LottieView
              autoPlay
              source={require("../../../assets/animations/success.json")}
              style={{
                height: 200,
                width: 200,
                alignSelf: "center",
              }}
              loop={false}
            />
          ),
        });
        router.replace("/(tabs)/");
      }, 2000);
      setSubmitting(false);
    }
    setSubmitting(false);
  };

  function calculateTenor(investmentDate, maturityDate) {
    const startDate = new Date(investmentDate);
    const endDate = new Date(maturityDate);

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference;
  }

  function convertToDateString(date) {
    return new Date(date).toDateString();
  }

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(999, "Please input an amount of at least 1000"),
  });
  return (
    <LayeredScreen
      overlay={true}
      headerText={header}
      headerImageUrl={headerImageUrl}
    >
      <View style={styles.container}>
        <ContentBox
          customStyles={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0,
            marginVertical: 20,
            backgroundColor: Colors.white,
          }}
        >
          <View style={[styles.flex, { gap: 10 }]}>
            <Money4
              color={Colors.primary}
              size={25}
              variant="Bold"
            />
            <StyledText
              type="title"
              variant="medium"
              color={Colors.primary}
            >
              Investment Balance
            </StyledText>
          </View>
          <StyledText
            type="heading"
            variant="semibold"
            color={Colors.primary}
            style={{
              textAlign: "center",
            }}
          >
            {amountFormatter.format(investment.currentValue)}
          </StyledText>
        </ContentBox>

        <Formik
          validationSchema={validationSchema}
          initialValues={{ amount: 0 }}
          onSubmit={async (values) => {
            const { amount } = values;
            if (Number(amount) > Number(investment?.currentValue)) {
              showMessage({
                message:
                  "Your Investment balance is insufficient for this transaction",
                type: "warning",
              });
              setSubmitting(false);
            } else {
              showWithdrawalAlert(investment.referenceNo, amount);
            }
          }}
        >
          {({ handleChange, handleSubmit }) => (
            <ContentBox customStyles={{ backgroundColor: Colors.white }}>
              <StyledText
                type="subheading"
                variant="semibold"
                color={Colors.primary}
                style={{ textAlign: "center", marginBottom: 25 }}
              >
                Withdraw Funds
              </StyledText>
              <View style={{ flexDirection: "row", gap: 5, marginBottom: 10 }}>
                <Clock
                  size={20}
                  color={Colors.primary}
                />
                <StyledText
                  color={Colors.primary}
                  type="body"
                  variant="medium"
                >
                  Tenor:{" "}
                  {calculateTenor(
                    investment?.valueDate,
                    investment?.maturityDate
                  )}{" "}
                  Days
                </StyledText>
              </View>
              <View style={{ flexDirection: "row", gap: 5, marginBottom: 10 }}>
                <PercentageCircle
                  size={20}
                  color={Colors.primary}
                />
                <StyledText
                  color={Colors.primary}
                  type="body"
                  variant="medium"
                >
                  Interest Rate: {investment?.interestRate}%
                </StyledText>
              </View>
              <View style={{ flexDirection: "row", gap: 5, marginBottom: 10 }}>
                <Calendar
                  size={20}
                  color={Colors.primary}
                />
                <StyledText
                  color={Colors.primary}
                  type="body"
                  variant="medium"
                >
                  Maturity Date: {convertToDateString(investment?.maturityDate)}
                </StyledText>
              </View>

              <AppTextField
                label={"Amount to withdraw"}
                name={"amount"}
                onChangeText={handleChange("amount")}
                leftIcon={
                  <StyledText
                    type="subheading"
                    variant="semibold"
                    color={Colors.primary}
                  >
                    ₦
                  </StyledText>
                }
                leftIconContainerStyle={{ marginLeft: 10 }}
                keyboardType="numeric"
              />
              <AppButton
                customStyles={{ marginTop: 20 }}
                onPress={handleSubmit}
              >
                {submitting === true ? (
                  <ActivityIndicator
                    size={"small"}
                    color={Colors.white}
                  />
                ) : (
                  "Withdraw"
                )}
              </AppButton>
            </ContentBox>
          )}
        </Formik>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default FixedIncomeWithdrawal;
