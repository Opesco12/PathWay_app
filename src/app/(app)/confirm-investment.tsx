import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Switch } from "@rneui/base";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { Entypo } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import LayeredScreen from "@/src/components/LayeredScreen";
import ContentBox from "@/src/components/ContentBox";
import AppDivider from "@/src/components/AppDivider";
import { Colors } from "@/src/constants/Colors";
import AppButton from "@/src/components/AppButton";
import StyledText from "@/src/components/StyledText";
import { router, useLocalSearchParams } from "expo-router";
import { amountFormatter } from "@/src/helperFunctions/amountFormatter";

import {
  fixedIncomeSubscriptionOrder,
  mutualFundSubscription,
} from "@/src/api";

const ConfirmInvestment = ({ route }) => {
  const {
    amount,
    header,
    headerImageUrl,
    portfolioId,
    portfolioTypeName,
    securityId,
    tenor,
  } = useLocalSearchParams();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const makeInvestment = async ({ amount, portfolioId, portfolioTypeName }) => {
    if (portfolioTypeName === "mutualfund") {
      const data = await mutualFundSubscription({
        amount: amount,
        portfolioId: portfolioId,
      });
      setLoading(false);
      return data;
    } else {
      const data = await fixedIncomeSubscriptionOrder({
        faceValue: amount,
        currency: "NGN",
        portfolioId: portfolioId,
        securityProductId: securityId,
        tenor: tenor,
      });
      setLoading(false);
      return data;
    }
  };

  return (
    <LayeredScreen
      headerImageUrl={headerImageUrl && headerImageUrl}
      headerText={header && header}
      overlay={true}
      customStyles={{ paddingHorizontal: 0 }}
    >
      <View style={styles.container}>
        <ContentBox
          customStyles={{
            borderWidth: 0,
            backgroundColor: Colors.white,
            elelvation: 2,
            marginTop: 20,
          }}
        >
          <StyledText
            color={Colors.primary}
            type="title"
            variant="semibold"
          >
            Confirm Investment
          </StyledText>

          <ContentBox customStyles={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText
                color={Colors.light}
                type="body"
                variant="regular"
              >
                Amount
              </StyledText>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "600",
                  fontSize: 22,
                }}
              >
                {amount && amountFormatter.format(amount)}
              </Text>
            </View>
            <AppDivider />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText
                color={Colors.light}
                type="body"
                variant="regular"
              >
                Management Fee(2%)
              </StyledText>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "600",
                  fontSize: 22,
                }}
              >
                {amountFormatter.format(0)}
              </Text>
            </View>

            <AppDivider />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText
                color={Colors.light}
                type="body"
                variant="regular"
              >
                Total Due
              </StyledText>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "600",
                  fontSize: 22,
                }}
              >
                {amount && amountFormatter.format(Number(amount) + 0)}
              </Text>
            </View>
          </ContentBox>

          <StyledText
            color={Colors.light}
            type="body"
            variant="medium"
          >
            Redemptions during the Lock-up Period will attract a 20% penalty on
            accrued returns eaned over the period.
          </StyledText>

          <StyledText
            color={Colors.light}
            type="body"
            variant="medium"
          >
            By tapping on the "Make Payment" button, you agree to have the Total
            Due deducted from your Wallet Balannce to create this investment
            plan.
          </StyledText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              gap: 10,
            }}
          >
            <Switch
              value={agreeToTerms}
              onValueChange={() => setAgreeToTerms(!agreeToTerms)}
            />
            <StyledText
              type="body"
              variant="medium"
              color={Colors.light}
            >
              Yes, I agree to the terms above
            </StyledText>
          </View>
          <AppButton
            disabled={!agreeToTerms}
            customStyles={{ marginTop: 20 }}
            onPress={async () => {
              setLoading(true);
              try {
                const data = await makeInvestment({
                  amount: amount,
                  portfolioId: portfolioId,
                  portfolioTypeName: portfolioTypeName,
                });
                if (data) {
                  setTimeout(() => {
                    showMessage({
                      position: "center",
                      message: "Investment Successful",
                      description: `You have successfully invested ₦${
                        amount && amount
                      } in ${header && header}`,
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
                    setLoading(false);
                    router.replace("/(tabs)/");
                  }, 2000);
                }
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {loading ? <ActivityIndicator size={"small"} /> : "Make Payment"}
          </AppButton>
        </ContentBox>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBg,
    flex: 1,
    paddingHorizontal: 15,
  },
});

export default ConfirmInvestment;
