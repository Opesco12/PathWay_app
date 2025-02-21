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
import React, { useState, useEffect, useRef, useContext } from "react";
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
  Bank,
} from "iconsax-react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import LayeredScreen from "@/src/components/LayeredScreen";
import AppRipple from "@/src/components/AppRipple";
import AppModal from "@/src/components/AppModal";

import { retrieveUserData } from "@/src/storage/userData";
import {
  getVirtualAccounts,
  getWalletBalance,
  debitWallet,
  getclientbankaccounts,
} from "@/src/api";

import Screen from "@/src/components/Screen";

import Banner from "@/assets/images/svg_images/Banner";
import { showMessage } from "react-native-flash-message";
import { Link, router } from "expo-router";
import { copyToClipboard } from "../../helperFunctions/copyToClipboard";
import { amountFormatter } from "../../helperFunctions/amountFormatter";
import CenterModal from "@/src/components/AppCenterModal";
import ContentBox from "@/src/components/ContentBox";
import AppTextField from "@/src/components/AppTextField";
import { useChat } from "@/src/context/ChatContext";

const index = () => {
  const [loading, setIsLading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const screenWidth = Dimensions.get("screen").width;
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    amount: 0,
  });
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [wallet, setWallet] = useState({});
  const [virtualAccount, setVirtualAccount] = useState([]);

  const fetchData = async () => {
    setIsLading(true);
    const data = await retrieveUserData();
    setUserData(data);
    setFirstname(data.fullName.split(" ")[0]);

    const userBalance = await getWalletBalance();
    console.log(userBalance);
    setWallet({
      name: userBalance[0].walletAccountName,
      accountNo: userBalance[0].walletAccountNo,
    });
    setUserBalance({
      currencyCode: userBalance[0].currencyCode,
      amount: userBalance[0].amount,
    });

    const virtualAccounts = await getVirtualAccounts();
    console.log("Virtual account: ", virtualAccounts);
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

  const formikRef = useRef();

  const withdrawalValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Withdrawal amount is required")
      .positive("Withdrawal amount must be greater than ₦200")
      .min(200, "Minimum withdrawal is ₦200")
      .max(
        userBalance.amount,
        `Withdrawal amount cannot exceed your balance of ₦${userBalance.amount}`
      ),
  });
  const withdrawalRequest = async (amount) => {
    const userBanks = await getclientbankaccounts();

    const requestData = {
      currencyCode: "NGN",
      amount: amount,
      walletBankAccountNo: userBalance?.walletAccountNo,
      beneficiaryBankAccountNo: userBanks[0]?.beneficiaryAccountNo,
    };

    if (amount > userBalance?.amount) {
      showMessage({
        message: "Insufficient Funds",
        type: "warning",
      });
    } else {
      const response = await debitWallet(requestData);
      if (response?.message === "Success") {
        showMessage({
          message: "Wallet Withdrawal is being processed.",
          description:
            "Kindly note that withdrawals are processed within 24 hours",
          type: "success",
        });
      } else {
        showMessage({
          message: "An error occured",
          type: "warning",
        });
      }
    }
  };

  const { toggleModal } = useChat();

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

              <View style={{ marginVertical: 15, gap: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <StyledText
                    color={Colors.white}
                    style={{ textAlign: "center" }}
                  >
                    {" "}
                    Wallet Account Number: {wallet?.accountNo}{" "}
                  </StyledText>
                  <Copy
                    size={25}
                    color={Colors.lightPrimary}
                    onPress={async () => {
                      await copyToClipboard(wallet?.accountNo);
                    }}
                  />
                </View>
                <StyledText
                  color={Colors.white}
                  style={{ textAlign: "center" }}
                >
                  {" "}
                  Wallet Account Name: {wallet?.name}
                </StyledText>
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
                  onpress={() => setIsDepositModalOpen(true)}
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
                  onpress={() => setIsWithdrawModalOpen(true)}
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
                  onPress={toggleModal}
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

        <CenterModal
          isVisible={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          title="Deposit"
          buttons={false}
        >
          <View
            style={{
              height: 80,
              width: 80,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.lightBg,
              borderRadius: 40,
              alignSelf: "center",
            }}
          >
            <Bank
              size={40}
              color={Colors.lightPrimary}
            />
          </View>
          <StyledText
            type="subheading"
            variant="semibold"
            style={{ marginVertical: 15, textAlign: "center" }}
          >
            Bank Transfer
          </StyledText>
          <StyledText
            type="body"
            style={{ marginVertical: 15 }}
            style={{ textAlign: "center", opacity: 0.8, marginBottom: 30 }}
          >
            Send money to the bank account details below {"\n"}
            {/* {`Please note that there is a ${amountFormatter.format(
              100
            )} charge for Wallet Top-up`} */}
          </StyledText>

          <View style={{ marginBottom: 20 }}>
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 0.5,
                borderColor: Colors.border,
                padding: 10,
                borderRadius: 10,
                gap: 10,
              }}
            >
              <View>
                <StyledText
                  variant="medium"
                  color={Colors.secondary}
                >
                  {wallet?.accountNo}
                </StyledText>
                <StyledText color={Colors.light}>{wallet?.name}</StyledText>
                {/* <StyledText variant="medium">
                    {account?.virtualAccountBankName
                      ? account?.virtualAccountBankName
                      : "Rand Merchant Bank"}
                  </StyledText> */}
              </View>

              <Copy
                size={25}
                color={Colors.lightPrimary}
                onPress={async () => {
                  await copyToClipboard(account?.virtualAccountNo);
                  setIsDepositModalOpen(false);
                }}
              />
            </View>
          </View>
        </CenterModal>
        <CenterModal
          isVisible={isWithdrawModalOpen}
          onClose={() => !isSubmitting && setIsWithdrawModalOpen(false)}
          title="Withdraw"
          primaryButtonText="Withdraw"
          onPrimaryPress={() => formikRef.current?.handleSubmit()}
        >
          <Formik
            innerRef={formikRef}
            initialValues={{ amount: "" }}
            onSubmit={async (values) => {
              setIsSubmitting(true);
              const { amount } = values;

              await withdrawalRequest(amount);
              setIsSubmitting(false);
            }}
            validationSchema={withdrawalValidationSchema}
          >
            {({ handleChange }) => (
              <AppTextField
                name="amount"
                onChangeText={handleChange("amount")}
                label="Amount"
              />
            )}
          </Formik>
        </CenterModal>
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
