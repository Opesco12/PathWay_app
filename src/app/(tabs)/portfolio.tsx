import { StyleSheet, View, ActivityIndicator } from "react-native";
import {
  ArrowCircleRight2,
  Money4,
  Moneys,
  TrendUp,
} from "iconsax-react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import _ from "lodash";

import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import ContentBox from "@/src/components/ContentBox";

import { retrieveUserData } from "@/src/storage/userData";
import { amountFormatter } from "../../helperFunctions/amountFormatter";
import {
  getFixedIcomeOnlineBalances,
  getMutualFundOnlineBalances,
  getProducts,
  getWalletBalance,
} from "../../api/index";
import Loader from "@/src/components/Loader";
import Product from "@/src/components/Product";

const PortfolioList = ({ product }) => {
  const [fixedIncomeBalance, setFixedIncomeBalance] = useState(0);

  useEffect(() => {
    if (product.portfolioType === 9) {
      var balance = 0;
      console.log(product.investments);
      product.investments?.map(
        (investment) => (balance += investment.currentValue)
      );

      setFixedIncomeBalance(balance);
    }
  }, []);

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
    <ContentBox
      customStyles={{
        alignItems: "center",
        backgroundColor: Colors.white,
        borderWidth: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 0,
      }}
      onPress={() => {
        if (product?.portfolio !== "Wallet") {
          router.push({
            pathname: "/(app)/portfolio-details",
            params: {
              header: product?.portfolio,
              headerImageUrl: getProductImage(product?.portfolio),
              product: JSON.stringify(product),
              portfolioId: product.portfolioId,
              portfolioType: product.portfolioType,
              accountNo: product?.mutualfundAccountNo,
              balance:
                product.portfolioType === 9
                  ? fixedIncomeBalance
                  : product.balance,
            },
          });
        }
      }}
    >
      <View style={[styles.flex, { gap: 20 }]}>
        <TrendUp
          color={Colors.secondary}
          size={35}
          variant="Bold"
        />
        <View style={{}}>
          <StyledText
            type="title"
            variant="semibold"
            color={Colors.primary}
          >
            {product?.portfolio}
          </StyledText>
          <View style={[styles.flex, { gap: 10 }]}>
            <Moneys
              color={Colors.primary}
              size={20}
              variant="Bold"
            />
            <StyledText
              type="title"
              variant="semibold"
              color={Colors.light}
            >
              {product ? (
                product.portfolioType === 9 ? (
                  amountFormatter.format(fixedIncomeBalance)
                ) : (
                  amountFormatter.format(product.balance)
                )
              ) : (
                <ActivityIndicator
                  size={"small"}
                  color={Colors.primary}
                />
              )}
            </StyledText>
          </View>
        </View>
      </View>
      <ArrowCircleRight2
        color={Colors.primary}
        size={35}
        variant="Bold"
      />
    </ContentBox>
  );
};

const Portfolio = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    amount: 0,
  });
  const [mutualFundBalances, setMutualFundBalances] = useState([]);
  const [fixedIncomePortfolio, setFixedIncomePortfolio] = useState([]);

  const updateFixedIncomePortfolio = async (investibleProducts) => {
    const updatedPortfolio = await Promise.all(
      investibleProducts?.map(async (product) => {
        if (product.portfolioType === 9) {
          const fixedIncomeBalances = await getFixedIcomeOnlineBalances(
            product.portfolioId
          );
          if (fixedIncomeBalances?.length > 0) {
            return {
              portfolio: product.portfolioName,
              investments: fixedIncomeBalances,
              portfolioType: product.portfolioType,
              portfolioId: product.portfolioId,
            };
          }
        }
        return null;
      })
    );

    setFixedIncomePortfolio((prev) => {
      const newItems = updatedPortfolio.filter(
        (item) =>
          item !== null &&
          !prev.some((prevItem) => prevItem.portfolio === item.portfolio)
      );
      return [...prev, ...newItems];
    });
  };

  const fetchData = async () => {
    setLoading(true);

    const userBalance = await getWalletBalance();
    setUserBalance({
      currencyCode: userBalance[0].currencyCode,
      amount: userBalance[0].amount,
    });

    // const userPortfolio = await getClientPortfolio();
    const mutualFundBalances = await getMutualFundOnlineBalances();
    setMutualFundBalances(mutualFundBalances);

    const investibleProducts = await getProducts();
    investibleProducts && updateFixedIncomePortfolio(investibleProducts);

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    var totalBalance = userBalance.amount;
    fixedIncomePortfolio.forEach((portfolio) => {
      var balance = 0;
      portfolio?.investments?.forEach(
        (investment) => (balance += investment?.currentValue)
      );

      totalBalance += balance;
    });

    mutualFundBalances.forEach(
      (investment) => (totalBalance += investment?.balance)
    );

    setTotalBalance(totalBalance);
  }, [fixedIncomePortfolio, mutualFundBalances, userBalance]);

  return (
    <LayeredScreen
      headerText={"My Portfolio"}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {loading ? (
        <Loader />
      ) : (
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
                variant="regular"
                color={Colors.primary}
              >
                Total Portfolio Balance
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
              {totalBalance && amountFormatter.format(totalBalance)}
            </StyledText>
          </ContentBox>

          <ContentBox
            customStyles={{ borderWidth: 0, backgroundColor: Colors.white }}
          >
            <PortfolioList
              product={{ portfolio: "Wallet", balance: userBalance.amount }}
            />
            {mutualFundBalances?.map((product, index) => (
              <PortfolioList
                key={index}
                product={product}
              />
            ))}
            {fixedIncomePortfolio?.map((product, index) => (
              <PortfolioList
                key={index}
                product={product}
              />
            ))}
          </ContentBox>
        </View>
      )}
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

export default Portfolio;
