import { Image, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import {
  Book,
  ClipboardTick,
  Headphone,
  Lock1,
  LogoutCurve,
  Profile as ProfileIcon,
  UserOctagon,
} from "iconsax-react-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import AppListItem from "@/src/components/AppListItem";
import { retrieveUserData } from "@/src/storage/userData";
import { logout } from "@/src/api";
import { Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";

const Profile = () => {
  const [fullname, setFullname] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const logoutUser = async () => {
    const data = await logout(authToken);
    console.log(data);
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await retrieveUserData();
      setFullname(userData?.fullName);
      setAuthToken(userData?.token);
    };
    fetchData();
  }, []);
  return (
    <Screen>
      <StatusBar style="dark" />
      <AppHeader />
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginVertical: 25 }}>
          <StyledText
            type="heading"
            variant="semibold"
          >
            Profile
          </StyledText>
          <StyledText
            color={Colors.light}
            type="body"
            variant="medium"
          >
            {fullname}
          </StyledText>
        </View>
        <Image
          source={require("../../../assets/images/layer.png")}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
      </View>

      <View>
        <StyledText
          type="subheading"
          variant="medium"
          style={{ marginVertical: 10 }}
        >
          Account Settings
        </StyledText>
        <View>
          <Link
            href={"/personal-details"}
            asChild
          >
            <AppListItem
              leftIcon={
                <ProfileIcon
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Personal Details
            </AppListItem>
          </Link>
          <Link
            href={"/bank-details"}
            asChild
          >
            <AppListItem
              leftIcon={
                <Book
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Bank Details
            </AppListItem>
          </Link>
          <Link
            href={"/kyc-1"}
            asChild
          >
            <AppListItem
              leftIcon={
                <ClipboardTick
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              KYC
            </AppListItem>
          </Link>
          <Link
            href={"/"}
            asChild
          >
            <AppListItem
              leftIcon={
                <UserOctagon
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Contact Account Manager
            </AppListItem>
          </Link>
          <Link
            href={"/change-password"}
            asChild
          >
            <AppListItem
              leftIcon={
                <Lock1
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Change Password
            </AppListItem>
          </Link>
          <AppListItem
            leftIcon={
              <Headphone
                size={20}
                color={Colors.primary}
              />
            }
          >
            Help & Support
          </AppListItem>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <Pressable onPress={logoutUser}>
          <View style={styles.signout}>
            <LogoutCurve
              size={20}
              color={Colors.error}
            />
            <StyledText
              color={Colors.error}
              type="title"
              variant="medium"
            >
              Signout
            </StyledText>
          </View>
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  signout: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.border,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
});

export default Profile;
