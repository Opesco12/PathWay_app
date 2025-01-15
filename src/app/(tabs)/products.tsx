import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";

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
        if (product.portfolioTypeName === filter) {
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
  const productImages = {
    0: require("@/assets/images/products/0.png"),
    1: require("@/assets/images/products/1.png"),
    2: require("@/assets/images/products/2.png"),
    3: require("@/assets/images/products/3.png"),
    4: require("@/assets/images/products/4.png"),
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
                        img={
                          index < 5 ? productImages[index] : productImages[0]
                        }
                      />
                    ) : (
                      product.portfolioTypeName === filter && (
                        <Product
                          product={product}
                          key={index}
                          img={
                            index < 5 ? productImages[index] : productImages[0]
                          }
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
