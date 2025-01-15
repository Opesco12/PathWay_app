import {
  Dimensions,
  StyleSheet,
  View,
  Pressable,
  BackHandler,
  ActivityIndicator,
  Text,
  ImageBackground,
  StatusBar,
  Platform,
  ScrollView,
  RefreshControl,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import {
  EmptyWallet,
  Notification,
  ReceiveSquare2,
  TransmitSqaure2,
  StatusUp,
  FavoriteChart,
  ReceiptText,
  Reserve,
  Flash,
  Eye,
  EyeSlash,
  Copy,
  Refresh2,
  ProfileCircle,
} from "iconsax-react-native";

import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import LayeredScreen from "@/src/components/LayeredScreen";
import AppRipple from "@/src/components/AppRipple";
import AppModal from "@/src/components/AppModal";

import { retrieveUserData } from "@/src/storage/userData";
import { getVirtualAccounts, getWalletBalance } from "@/src/api";

import Screen from "@/src/components/Screen";

import Banner from "@/assets/images/svg_images/Banner";
import { showMessage } from "react-native-flash-message";
import { Link, router } from "expo-router";
import { copyToClipboard } from "../../helperFunctions/copyToClipboard";
import { amountFormatter } from "../../helperFunctions/amountFormatter";
import ContentBox from "@/src/components/ContentBox";

const index = () => {
  const [loading, setIsLading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const screenWidth = Dimensions.get("screen").width;
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    amount: 0,
  });
  const [userVirtualAccounts, setUserVirtualAccounts] = useState([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState([]);
  const [copiedText, setCopiedText] = useState("");

  const fetchData = async () => {
    setIsLading(true);
    const data = await retrieveUserData();
    setUserData(data);
    setFirstname(data.fullName.split(" ")[0]);

    const userBalance = await getWalletBalance();
    console.log(userBalance);
    setUserBalance({
      currencyCode: userBalance[0].currencyCode,
      amount: userBalance[0].amount,
    });

    const virtualAccounts = await getVirtualAccounts();
    setVirtualAccount(virtualAccounts);
    setIsLading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          style={{ backgroundColor: Colors.primary }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <ImageBackground
            source={require("@/assets/images/layer.png")}
            style={styles.layer}
          >
            <View
              style={{
                zIndex: 20,
                // position: "absolute",
                top: "20%",
                position: "relative",
                padding: 20,
                width: "100%",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                }}
              >
                <StyledText
                  variant="medium"
                  type="heading"
                  color={Colors.white}
                >
                  Hello, {firstname}
                </StyledText>

                <ProfileCircle
                  color={Colors.secondary}
                  variant="Bold"
                  size={50}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  height: 0.5,
                  backgroundColor: Colors.secondary,
                }}
              />

              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                  paddingVertical: 10,
                }}
              >
                <EmptyWallet
                  size={25}
                  color={Colors.secondary}
                  variant="Bold"
                />
                <StyledText color={Colors.white}> Wallet Balance</StyledText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <StyledText
                  variant="semibold"
                  type="heading"
                  color={Colors.white}
                  style={{ textAlign: "center", marginTop: 10, fontSize: 35 }}
                >
                  {hideBalance
                    ? "₦******"
                    : amountFormatter.format(userBalance?.amount)}
                </StyledText>

                {hideBalance ? (
                  <EyeSlash
                    size={25}
                    color={Colors.white}
                    onPress={() => setHideBalance(!hideBalance)}
                  />
                ) : (
                  <Eye
                    size={25}
                    color={Colors.white}
                    onPress={() => setHideBalance(!hideBalance)}
                  />
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 15,
                  marginTop: 25,
                }}
              >
                <Button
                  icon={
                    <ReceiveSquare2
                      size={30}
                      color={Colors.primary}
                      variant="Bold"
                    />
                  }
                  text="Deposit"
                  onpress={() => console.log("Deposit modal pressed")}
                />
                <Button
                  icon={
                    <TransmitSqaure2
                      size={30}
                      color={Colors.secondary}
                      variant="Bold"
                    />
                  }
                  text="Withdraw"
                  onpress={() => console.log("Withdraw modal pressed")}
                />
              </View>
            </View>

            <LinearGradient
              colors={["transparent", Colors.primary]}
              style={styles.gradient}
            />
          </ImageBackground>
          {/* </View> */}
          <View
            style={{
              backgroundColor: Colors.primary,
              flex: 0.55,
              padding: 20,
              position: "relative",
              paddingTop: "20%",
            }}
          >
            <ContentBox
              customStyles={{
                backgroundColor: Colors.white,
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 7, paddingVertical: 7 }}
              >
                <Flash
                  size={30}
                  variant="Bold"
                  color={Colors.secondary}
                />
                <StyledText type="title">Quick Access</StyledText>
              </View>
              <View
                style={{
                  width: "100%",
                  height: 0.5,
                  backgroundColor: Colors.secondary,
                  marginBottom: 15,
                }}
              />
              <ContentBox
                customStyles={{
                  backgroundColor: Colors.lightSecondary,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => router.push("/(tabs)/products")}
              >
                <View>
                  <StyledText
                    variant="semibold"
                    type="subheading"
                    style={{ width: "75%" }}
                  >
                    Invest Money
                  </StyledText>
                  <StyledText style={{ width: "75%" }}>
                    Grow your wealth securely
                  </StyledText>
                </View>
                <StatusUp
                  size={45}
                  color={Colors.secondary}
                  variant="Bold"
                />
              </ContentBox>

              <ContentBox
                customStyles={{
                  backgroundColor: Colors.lightSecondary,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => router.push("/(tabs)/portfolio")}
              >
                <View>
                  <StyledText
                    variant="semibold"
                    type="subheading"
                    style={{ width: "75%" }}
                  >
                    My Portfolio
                  </StyledText>
                  <StyledText style={{ width: "75%" }}>
                    Track your investments at a glance
                  </StyledText>
                </View>
                <FavoriteChart
                  size={45}
                  color={Colors.secondary}
                  variant="Bold"
                />
              </ContentBox>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ContentBox
                  customStyles={{
                    backgroundColor: Colors.lightSecondary,
                  }}
                  width={"48%"}
                  onPress={() => router.push("/transactions")}
                >
                  <ReceiptText
                    size={20}
                    color={Colors.secondary}
                    variant="Bold"
                  />
                  <View>
                    <StyledText
                      variant="semibold"
                      type="subheading"
                    >
                      Transactions
                    </StyledText>
                    <StyledText>Monitor your financial activity</StyledText>
                  </View>
                </ContentBox>

                <ContentBox
                  customStyles={{
                    backgroundColor: Colors.lightSecondary,
                  }}
                  width={"48%"}
                >
                  <Reserve
                    size={20}
                    color={Colors.secondary}
                    variant="Bold"
                  />
                  <View>
                    <StyledText
                      variant="semibold"
                      type="subheading"
                    >
                      Help Desk
                    </StyledText>
                    <StyledText>Reliable support when you need it</StyledText>
                  </View>
                </ContentBox>
              </View>
            </ContentBox>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    // backgroundColor: Colors.secondary,
  },
  layer: {
    flex: 0.45,
    justifyContent: "flex-end",
  },
  gradient: {
    height: "15%",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});

export default index;

const Button = ({ text, onpress, icon }) => {
  return (
    <Pressable
      style={{ width: "40%" }}
      onPress={onpress}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: Colors.white,
          borderRadius: 22,
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
          height: 50,
          width: "100%",
        }}
      >
        {icon}
        <Text>{text}</Text>
      </View>
    </Pressable>
  );
};
