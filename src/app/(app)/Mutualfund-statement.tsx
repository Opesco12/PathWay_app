import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import _ from "lodash";

import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";
import { getMutualFundStatement, getProducts } from "@/src/api";
import { showMessage } from "react-native-flash-message";

const MutualfundStatement = () => {
  const [statement, setStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const { header, headerImageUrl, balance } = useLocalSearchParams();

  useEffect(() => {
    const findProduct = async () => {
      setLoading(true);

      const products = await getProducts();

      const foundProduct = await products?.find(
        (p) => _.kebabCase(p?.portfolioName) === _.kebabCase(header)
      );

      if (!foundProduct) {
        showMessage({ message: "Unable to fetch statement", type: "warning" });
      } else {
        console.log(foundProduct);
        const statement = await getMutualFundStatement(
          foundProduct?.portfolioId
        );
        console.log(statement.object);
        setStatement(statement?.object);
      }

      setLoading(false);
    };
    findProduct();
  }, []);
  return (
    <LayeredScreen
      overlay={true}
      headerText={header}
      headerImageUrl={headerImageUrl}
    >
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            size={"large"}
            color={Colors.primary}
          />
        </View>
      ) : (
        <View style={styles.container}>
          {statement?.length > 0 &&
            statement?.slice(0, -1).map((transaction, index) => (
              <StatementItem
                statement={transaction}
                key={index}
              />
            ))}
          <StatementItem
            statement={{ ...statement[statement.length - 1], amount: balance }}
          />
        </View>
      )}
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});

const StatementItem = ({ statement }) => {
  const date = new Date(statement?.transDate).toDateString();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light,
      }}
    >
      <View style={{ width: "60%" }}>
        <StyledText
          variant="medium"
          numberOfLines={1}
        >
          {statement?.narration}
        </StyledText>
        <StyledText
          color={Colors.light}
          numberOfLines={1}
        >
          {`${
            statement?.units ? statement?.units : 0
          } units @ ${amountFormatter.format(statement?.price)}`}
        </StyledText>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <StyledText color={Colors.light}> {date && date}</StyledText>
        <StyledText variant="medium">
          {amountFormatter.format(statement?.amount ? statement?.amount : 0)}
        </StyledText>
      </View>
    </View>
  );
};

export default MutualfundStatement;
