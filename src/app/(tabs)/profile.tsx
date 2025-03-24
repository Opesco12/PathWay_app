import { Image, StyleSheet, View, Linking } from "react-native";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import {
  Book,
  ClipboardTick,
  DocumentText,
  Global,
  Headphone,
  Lock1,
  LogoutCurve,
  MessageText1,
  Profile as ProfileIcon,
  Security,
  UserOctagon,
  UserCirlceAdd,
} from "iconsax-react-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import AppListItem from "@/src/components/AppListItem";
import { retrieveUserData } from "@/src/storage/userData";
import {
  fetchClientPhoto,
  uploadImage,
  getWalletBalance,
  logout,
} from "@/src/api";
import { Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useChat } from "@/src/context/ChatContext";
import { set } from "lodash";
import ProfileImageUploadModal from "@/src/components/ImageUploadModal";
import { showMessage } from "react-native-flash-message";

const Profile = () => {
  const { toggleModal } = useChat();

  const [fullname, setFullname] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [wallet, setWallet] = useState({ accountNo: "", name: "" });
  const [profileImage, setProfileImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const logoutUser = async () => {
    const data = await logout(authToken);
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getWalletBalance();
      setWallet({
        accountNo: userProfile[0].walletAccountNo,
        name: userProfile[0].walletAccountName,
      });

      const userData = await retrieveUserData();
      setFullname(userData?.fullName);
      setAuthToken(userData?.token);

      const profileImage = await fetchClientPhoto();
      setProfileImage(profileImage?.photo);
    };
    fetchData();
  }, []);

  const openWebsite = () => {
    Linking.openURL("https://pathway.ng/");
  };

  const handleUpload = async () => {
    try {
      if (!selectedImage) {
        showMessage({ message: "Please select an image", type: "warning" });
      } else {
        const response = await uploadImage(selectedImage);
        if (response?.message === "Success") {
          showMessage({ message: "Upload Succesful", type: "success" });
          const profileImage = await fetchClientPhoto();
          setProfileImage(profileImage?.photo);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        <View style={{ marginTop: 25 }}>
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

        {profileImage?.length > 0 ? (
          <Image
            src={`data:image/jpeg;base64,${profileImage}`}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          />
        ) : (
          <UserCirlceAdd
            size={50}
            color={Colors.light}
            variant="Bold"
            onPress={() => setIsModalVisible(true)}
          />
        )}
      </View>

      <View
        style={{
          borderColor: Colors.border,
          borderWidth: 1,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          marginVertical: 10,
          paddingVertical: 10,
        }}
      >
        <StyledText
          variant="medium"
          color={Colors.primary}
          numberOfLines={1}
        >
          PathWay Account ID:{" "}
          <StyledText color={Colors.light}>{wallet?.name}</StyledText>
        </StyledText>
        <StyledText
          variant="medium"
          color={Colors.primary}
        >
          Wallet Account Number:{" "}
          <StyledText color={Colors.light}>{wallet?.accountNo}</StyledText>
        </StyledText>
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
            href={"/contact-manager"}
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
            onPress={openWebsite}
            leftIcon={
              <Global
                size={20}
                color={Colors.primary}
              />
            }
          >
            Visit our website
          </AppListItem>

          <Link
            href={""}
            asChild
          >
            <AppListItem
              leftIcon={
                <DocumentText
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Terms and Conditions
            </AppListItem>
          </Link>

          <Link
            href={""}
            asChild
          >
            <AppListItem
              leftIcon={
                <Security
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Privacy Policy
            </AppListItem>
          </Link>

          <AppListItem
            onPress={toggleModal}
            leftIcon={
              <Headphone
                size={20}
                color={Colors.primary}
              />
            }
          >
            Help & Support
          </AppListItem>

          <Link
            href={""}
            asChild
          >
            <AppListItem
              leftIcon={
                <MessageText1
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              FAQs
            </AppListItem>
          </Link>
        </View>
      </View>

      <View
        style={{
          marginVertical: 30,
        }}
      >
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
      <ProfileImageUploadModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onUpload={handleUpload}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
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
