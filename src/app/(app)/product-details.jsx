import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Moneys,
  Calendar2,
  PercentageCircle,
  Judge,
} from "iconsax-react-native";
import { router, useLocalSearchParams } from "expo-router";

import ContentBox from "@/src/components/ContentBox";
import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import SavingDetails from "@/src/components/SavingDetails";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";
import Loader from "@/src/components/Loader";
import {
  getFixedIcomeOnlineBalances,
  getLiabilityProducts,
  getMutualFundOnlineBalance,
  getTenor,
  getWalletBalance,
  mutualFundSubscription,
} from "@/src/api";
import { showMessage } from "react-native-flash-message";
import AppPicker from "@/src/components/AppPicker";

const ProductDetails = ({}) => {
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [isLiabilityProduct, setIsLiabilityProduct] = useState(false);
  const [liabilityProducts, setLiabilityProducts] = useState([]);
  const [productTenors, setProductTenors] = useState([]);
  const [selectedTenor, setSelectedTenor] = useState(null);
  const [investmentBalance, setInvestmentBalance] = useState(null);

  const {
    header,
    headerImageUrl,
    product: productString,
  } = useLocalSearchParams();
  const product = JSON.parse(productString);
  console.log(product);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(0, "Please input amount"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userBalance = await getWalletBalance();
      setUserBalance(userBalance[0]);

      if (product.portfolioType === 9) {
        const investmentbalances = await getFixedIcomeOnlineBalances(
          product.portfolioId
        );
        var balance = 0;
        investmentbalances?.map((investment, index) => {
          balance += investment.currentValue;
        });
        setInvestmentBalance(balance);
      } else {
        const investment = await getMutualFundOnlineBalance(
          product.portfolioId
        );
        if (investment) setInvestmentBalance(investment?.balance);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (product.portfolioType === 9) {
        setIsLiabilityProduct(true);
        const liabilityProducts = await getLiabilityProducts(
          product.portfolioId
        );

        console.log("liabilty products:", liabilityProducts);
        if (liabilityProducts) {
          setLiabilityProducts(liabilityProducts);
          const tenors = await getTenor(liabilityProducts[0].productId);
          setProductTenors(tenors);
        }
      }
    };
    fetchData();
  }, []);

  const tenorOptions = productTenors?.map((tenor, index) => {
    return {
      label: `${tenor.tenor} Days`,
      value: tenor.tenor,
    };
  });

  return (
    <LayeredScreen
      overlay={true}
      headerImageUrl={headerImageUrl && headerImageUrl}
      headerText={header && header}
    >
      {loading ? (
        <Loader />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <ContentBox
              customStyles={{
                backgroundColor: Colors.white,
                borderWidth: 0,
                elevation: 1,
                marginBottom: 20,
                marginVertical: 15,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledText
                  color={Colors.lightPrimary}
                  type="title"
                  variant="semibold"
                  style={{ color: Colors.lightPrimary, fontSize: 15 }}
                >
                  Current Investment Balance
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
                {amountFormatter.format(investmentBalance)}
              </StyledText>
            </ContentBox>

            <ContentBox
              customStyles={{
                // borderColor: Colors.primary,
                marginBottom: 20,
                gap: 15,
                backgroundColor: Colors.white,
              }}
            >
              <ContentBox customStyles={{ padding: 0, borderWidth: 0 }}>
                <ContentBox
                  customStyles={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 0,
                    borderWidth: 0,
                  }}
                >
                  <SavingDetails
                    title={"Annualized Yield"}
                    detail={product?.return + "%"}
                    icon={
                      <PercentageCircle
                        variant="Bold"
                        size={25}
                        color={Colors.primary}
                      />
                    }
                  />
                  <SavingDetails
                    title={"Min. Investment"}
                    detail={amountFormatter.format(product?.minimumInvestment)}
                    icon={
                      <Moneys
                        variant="Bold"
                        size={25}
                        color={Colors.primary}
                      />
                    }
                  />
                </ContentBox>
              </ContentBox>

              <ContentBox
                customStyles={{
                  padding: 0,
                  borderWidth: 0,
                }}
              >
                <ContentBox
                  customStyles={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 0,
                    borderWidth: 0,
                  }}
                >
                  <SavingDetails
                    title={"Min. Holding Period"}
                    detail={`${product?.minimumHoldingPeriod} Days`}
                    icon={
                      <Calendar2
                        variant="Bold"
                        size={25}
                        color={Colors.primary}
                      />
                    }
                  />
                  <SavingDetails
                    title={"Penalty Rate"}
                    detail={`${product?.earlyRedemptionPenaltyRate}%`}
                    icon={
                      <Judge
                        variant="Bold"
                        size={25}
                        color={Colors.primary}
                      />
                    }
                  />
                </ContentBox>
              </ContentBox>
            </ContentBox>

            <StyledText
              style={{ marginVertical: 10 }}
              color={Colors.primary}
            >
              {product?.productMandate}
            </StyledText>

            <Formik
              validationSchema={validationSchema}
              initialValues={{ amount: 0 }}
              onSubmit={(values, { setSubmitting }) => {
                const { amount } = values;
                setSubmitting(true);
                if (amount > userBalance.amount) {
                  showMessage({
                    message:
                      "Your wallet balance is insufficient to make this investment",
                    type: "warning",
                  });
                  setSubmitting(false);
                } else {
                  if (amount < product.minimumInvestment) {
                    showMessage({
                      message: `Minimum investment is ${amountFormatter.format(
                        product.minimumInvestment
                      )}`,
                      type: "warning",
                    });
                    setSubmitting(false);
                  } else {
                    if (isLiabilityProduct) {
                      if (!selectedTenor) {
                        showMessage({
                          message: "Please select a product tenor",
                          type: "warning",
                        });
                        setSubmitting(false);
                      } else {
                        setTimeout(() => {
                          setSubmitting(false);
                          router.push({
                            pathname: "/investment-simulation",
                            params: {
                              header: header,
                              headerImageUrl: headerImageUrl && headerImageUrl,
                              amount: Number(amount),
                              portfolioId: product?.portfolioId,
                              portfolioTypeName: product?.portfolioTypeName,
                              isLiabilityProduct: true,
                              securityId:
                                liabilityProducts[0].securityProductId,
                              tenor: selectedTenor,
                            },
                          });
                        }, 3000);
                      }
                    } else {
                      setTimeout(() => {
                        setSubmitting(false);
                        router.push({
                          pathname: "/investment-simulation",
                          params: {
                            header: header,
                            headerImageUrl: headerImageUrl && headerImageUrl,
                            amount: Number(amount),
                            portfolioId: product?.portfolioId,
                            portfolioTypeName: product?.portfolioTypeName,
                          },
                        });
                      }, 3000);
                    }
                  }
                }
              }}
            >
              {({ handleChange, handleSubmit, isSubmitting }) => (
                <ContentBox customStyles={{ backgroundColor: Colors.white }}>
                  <StyledText
                    type="title"
                    color={Colors.primary}
                    variant="semibold"
                    style={{ textAlign: "center" }}
                  >
                    Invest Funds
                  </StyledText>
                  <AppTextField
                    label={"Amount to invest"}
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

                  {isLiabilityProduct && (
                    <AppPicker
                      label={"Tenor"}
                      placeholder={"Select Tenor"}
                      options={tenorOptions}
                      value={selectedTenor}
                      onValueChange={(value) => setSelectedTenor(value)}
                    />
                  )}
                  <AppButton
                    customStyles={{ marginTop: 20 }}
                    onPress={handleSubmit}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.white}
                      />
                    ) : (
                      "Invest Now"
                    )}
                  </AppButton>
                </ContentBox>
              )}
            </Formik>
          </View>
        </View>
      )}
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ProductDetails;
