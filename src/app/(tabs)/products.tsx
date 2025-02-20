import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import _ from "lodash";

import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import Product from "@/src/components/Product";
import LayeredScreen from "@/src/components/LayeredScreen";
import Toggle from "@/src/components/Toggle";

import SEC from "../../../assets/images/svg_images/SEC";

import { getProducts } from "@/src/api";
import Loader from "@/src/components/Loader";

const Products = () => {
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  const toggleOptions = [
    { label: "All", value: "all" },
    { label: "Mutual Funds", value: "mutualfund" },
    { label: "Fixed Income", value: "liability" },
  ];

  const getNumberOfProducts = () => {
    if (filter === "all") {
      if (products?.length === 0) return 0;
      return products?.length;
    } else {
      let numberOfProducts = 0;
      products?.forEach((product) => {
        if (product?.portfolioTypeName === filter) {
          numberOfProducts++;
        }
      });
      return numberOfProducts;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);

    fetchData();
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
      refreshing={refreshing}
      onRefresh={handleRefresh}
      headerText={"Investment Products"}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Toggle
            options={toggleOptions}
            onValueChange={(value) => setFilter(value)}
          />

          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 6,
                marginVertical: 10,
              }}
            >
              <StyledText
                type="label"
                variant="medium"
                color={Colors.primary}
                style={{ textAlign: "center", marginVertical: 10 }}
              >
                {getNumberOfProducts()} investment products available
              </StyledText>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {products?.length > 0 &&
                products.map((product, index) => (
                  <Link
                    href={"/product-details"}
                    asChild
                    key={index}
                  >
                    {filter === "all" ? (
                      <Product
                        product={product}
                        key={index}
                        img={getProductImage(product?.portfolioName)}
                      />
                    ) : (
                      product.portfolioTypeName === filter && (
                        <Product
                          product={product}
                          key={index}
                          img={getProductImage(product?.portfolioName)}
                        />
                      )
                    )}
                  </Link>
                ))}
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 20,
              }}
            >
              <SEC />
            </View>
          </View>
        </>
      )}
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({});

export default Products;
