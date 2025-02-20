import React from "react";
import { StyleSheet, Text, Pressable, View, Image } from "react-native";
import { Moneys } from "iconsax-react-native";
import { router } from "expo-router";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import AppDivider from "./AppDivider";
import { amountFormatter } from "../helperFunctions/amountFormatter";

const Product = React.forwardRef(({ onPress, product, img }, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={() => {
        router.push({
          pathname: "/product-details",
          params: {
            header: product?.portfolioName,
            headerImageUrl: img,
            product: JSON.stringify(product),
          },
        });
      }}
      style={{ width: "48%" }}
    >
      <View style={styles.container}>
        <Image
          src={img}
          style={styles.image}
        />
        <View style={styles.smallContainer}>
          <StyledText
            color={Colors.primary}
            type="body"
            variant="semibold"
            numberOfLines={2}
          >
            {product && product.portfolioName}
          </StyledText>
          <View>
            <AppDivider />
            <View
              style={[
                styles.flex,
                { flexWrap: "wrap", gap: 5, justifyContent: "space-between" },
              ]}
            >
              <View style={[styles.flex, { gap: 5 }]}>
                <Moneys
                  size={16}
                  variant="Bold"
                  color={Colors.primary}
                />
                <StyledText
                  color={Colors.primary}
                  type="label"
                  variant="regular"
                >
                  <StyledText
                    type="label"
                    variant="semibold"
                  >
                    From{" "}
                    {product &&
                      amountFormatter.format(product.minimumInvestment)}
                  </StyledText>
                </StyledText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    paddingBottom: 5,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallContainer: {
    justifyContent: "space-between",
    padding: 10,
    flex: 1,
  },
  image: {
    height: 120,
    width: 200,
  },
});

export default Product;
