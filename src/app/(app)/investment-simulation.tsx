import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@rneui/base";
import { router, useLocalSearchParams } from "expo-router";
import _ from "lodash";

import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import ContentBox from "@/src/components/ContentBox";
import AppDivider from "@/src/components/AppDivider";
import AppPicker from "@/src/components/AppPicker";
import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";
import { getLiabilityProducts, getProducts, getTenor } from "@/src/api";
import { showMessage } from "react-native-flash-message";

const InvestmentSimulation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investmentProducts, setInvestmentProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [liabilityProduct, setLiabiltyProduct] = useState({});
  const [tenors, setTenors] = useState([]);
  const [selectedTenor, setSelectedTenor] = useState(null);
  const [principal, setPrincipal] = useState(0);

  const { portfolioId, amount } = useLocalSearchParams();

  const investmentOptions = useMemo(() => {
    return investmentProducts?.map((product) => ({
      label: product?.portfolioName,
      value: product?.portfolioId,
    }));
  }, [investmentProducts]);

  useEffect(() => {
    const fetchData = async () => {
      setPrincipal(Number(amount));
      try {
        const products = await getProducts();
        setInvestmentProducts(products);

        if (portfolioId && products.length > 0) {
          const options = products.map((product) => ({
            label: product.portfolioName,
            value: product.portfolioId,
          }));

          const selected = options.find(
            (product) => product.value === Number(portfolioId)
          );

          if (selected) {
            setSelectedProduct(selected?.value);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [portfolioId]);

  useEffect(() => {
    const fetchData = async () => {
      const pickedProduct = investmentProducts.find(
        (product) => product?.portfolioId === selectedProduct
      );
      if (pickedProduct?.portfolioType === 9) {
        const liabilityProduct = await getLiabilityProducts(
          pickedProduct?.portfolioId
        );

        setLiabiltyProduct(liabilityProduct[0]);
        if (liabilityProduct) {
          const tenors = await getTenor(liabilityProduct[0]?.productId);
          console.log("Tenors: ", tenors);
          setTenors(tenors);
        }
      }
    };

    fetchData();
  }, [selectedProduct]);

  const tenorOptions = tenors?.map((tenor) => {
    return {
      label: `${tenor?.tenor} Days`,
      value: tenor?.tenor,
    };
  });

  const findSelectedProduct = investmentProducts?.find(
    (product) => product?.portfolioId === selectedProduct
  );

  const findSelectedTenor = tenors.find(
    (tenor) => tenor?.tenor === selectedTenor
  );

  const selectedTenorInterestRate =
    findSelectedTenor && findSelectedTenor?.interestRate;

  const addDaysToDate = (days, startDate = new Date()) => {
    const result = new Date(startDate);
    result.setDate(startDate.getDate() + days);
    return result.toDateString();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (principal >= findSelectedProduct?.minimumInvestment) {
      if (selectedTenor) {
        setTimeout(() => {
          setIsSubmitting(false);
          router.push({
            pathname: "/confirm-investment",
            params: {
              header: findSelectedProduct?.portfolioName,
              headerImageUrl: getProductImage(
                findSelectedProduct?.portfolioName
              ),
              amount: amount,
              portfolioId: findSelectedProduct?.portfolioId,
              portfolioTypeName: findSelectedProduct?.portfolioTypeName,

              isLiabilityProduct: findSelectedProduct?.portfolioType === 9,
              securityId:
                findSelectedProduct?.portfolioType === 9 &&
                liabilityProduct?.securityProductId,
              tenor: findSelectedProduct?.portfolioType === 9 && selectedTenor,
            },
          });
        }, 3000);
      } else {
        setIsSubmitting(false);
        showMessage({
          message: "Please select a tenor",
          type: "warning",
        });
      }
    } else {
      setIsSubmitting(false);
      showMessage({
        message: `Minimum investment amount for this product is ${amountFormatter.format(
          findSelectedProduct?.minimumInvestment
        )}`,
        type: "warning",
      });
    }
  };

  const getProductImage = (productName) => {
    const products = [
      "pathway_money_market_note",
      "pathway_fixed_income_note",
      "pathway_fixed_deposit_note",
      "pathway_dollar_note",
      "pathway_hybrid_note",
    ];
    if (products.includes(_.snakeCase(productName))) {
      return `https://res.cloudinary.com/dtu6cxvk6/image/upload/${_.snakeCase(
        productName
      )}.png`;
    } else {
      return `https://res.cloudinary.com/dtu6cxvk6/image/upload/default.png`;
    }
  };

  return (
    <LayeredScreen
      headerText={"Investment Simulation"}
      sticky={false}
      backButton={true}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <StyledText
            color={Colors.primary}
            type="label"
            variant="medium"
            style={{ marginBottom: 2 }}
          >
            Principal
          </StyledText>
        </View>
        <Input
          containerStyle={{
            paddingHorizontal: 0,
          }}
          inputContainerStyle={styles.input}
          leftIcon={
            <StyledText
              color={Colors.primary}
              variant="medium"
            >
              ₦
            </StyledText>
          }
          value={principal.toString()}
          onChangeText={(value) => setPrincipal(Number(value))}
        />

        <AppPicker
          label={"Investment Product"}
          options={investmentOptions}
          value={selectedProduct}
          placeholder={"Select Investment Product"}
          onValueChange={(value) => setSelectedProduct(value)}
        />
        {findSelectedProduct?.portfolioType !== 9 && (
          <StyledText
            type="label"
            color={Colors.secondary}
          >
            Returns:
            <StyledText variant="semibold">
              {`${findSelectedProduct?.return}%`}
            </StyledText>
          </StyledText>
        )}

        {findSelectedProduct?.portfolioType === 9 && (
          <>
            <AppPicker
              label={"Desired Tenor"}
              options={tenorOptions}
              value={selectedTenor}
              placeholder={"Select Tenor"}
              onValueChange={(value) => setSelectedTenor(value)}
            />
            {selectedTenor && (
              <StyledText
                type="label"
                color={Colors.secondary}
              >
                Returns:
                <StyledText variant="semibold">
                  {`${selectedTenorInterestRate}%`}
                </StyledText>
              </StyledText>
            )}
          </>
        )}
        <StyledText
          type="label"
          style={{ marginTop: 15 }}
        >
          Simulation Details
        </StyledText>

        <ContentBox
          customStyles={{
            borderColor: Colors.secondary,
            borderWidth: 1,
            borderRadius: 12,
            marginVertical: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StyledText
              color={Colors.secondary}
              type="body"
              variant="semibold"
            >
              Principal
            </StyledText>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              {amountFormatter.format(Number(principal))}
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
              color={Colors.secondary}
              type="body"
              variant="semibold"
            >
              Estimated Returns
            </StyledText>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              {selectedTenor
                ? findSelectedProduct?.portfolioType === 9
                  ? amountFormatter.format(
                      (selectedTenorInterestRate &&
                        selectedTenorInterestRate / 100) * principal
                    )
                  : amountFormatter.format(
                      (findSelectedProduct?.return / 100) * principal
                    )
                : amountFormatter.format(0)}
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
              color={Colors.secondary}
              type="body"
              variant="semibold"
            >
              Estimated Payout
            </StyledText>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              {selectedTenor
                ? findSelectedProduct?.portfolioType === 9
                  ? amountFormatter.format(
                      (selectedTenorInterestRate &&
                        selectedTenorInterestRate / 100) *
                        principal +
                        principal
                    )
                  : amountFormatter.format(
                      (findSelectedProduct?.return / 100) * principal +
                        principal
                    )
                : amountFormatter.format(0)}
            </Text>
          </View>

          {findSelectedProduct?.portfolioType === 9 && (
            <>
              <AppDivider />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <StyledText
                  color={Colors.secondary}
                  type="body"
                  variant="semibold"
                >
                  Maturity Date
                </StyledText>
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {selectedTenor && addDaysToDate(selectedTenor)}
                </Text>
              </View>
            </>
          )}
        </ContentBox>
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
            "Proceed to Invest"
          )}
        </AppButton>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  input: {
    borderColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    height: 49,
    paddingHorizontal: 10,
  },
});

export default InvestmentSimulation;
