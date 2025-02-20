import React, { useEffect, useState } from "react";
import { Linking, TouchableOpacity, Text, View } from "react-native";

import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";
import ContentBox from "@/src/components/ContentBox";

import { getRelationshipManager } from "@/src/api";

const ContactAccountManager = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRelationshipManager();

      console.log(data);
    };

    fetchData();
  }, []);
  return (
    <Screen>
      <AppHeader />
      <View style={{ marginTop: 25 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Contact Account Manager
        </StyledText>
      </View>

      <ContentBox customStyles={{ flexDirection: "row", gap: 20 }}>
        <View style={{ gap: 10 }}>
          <StyledText>Mail:</StyledText>
          <StyledText>Phone:</StyledText>
        </View>

        <View style={{ gap: 10 }}>
          <ContactLink
            type={"email"}
            value={"info@pathwayassetmanagement.com"}
          >
            info@pathwayassetmanagement.com
          </ContactLink>

          <ContactLink
            type={"phone"}
            value={"+2347070339449"}
          >
            (+234) 707 - 033 - 9449
          </ContactLink>
        </View>
      </ContentBox>
    </Screen>
  );
};
export default ContactAccountManager;

const ContactLink = ({ type, value, children }) => {
  const handlePress = async () => {
    try {
      let link;

      if (type === "phone") {
        link = `tel:${value}`;
      } else if (type === "email") {
        link = `mailto:${value}`;
      } else {
        throw new Error('Unsupported contact type. Use "phone" or "email".');
      }

      const canOpen = await Linking.canOpenURL(link);
      if (!canOpen) {
        Alert.alert(
          "Action not supported",
          `Your device cannot handle ${
            type === "phone" ? "phone calls" : "email"
          }.`
        );
        return;
      }

      await Linking.openURL(link);
    } catch (error) {
      console.error(`Error opening ${type} app:`, error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <StyledText
        style={{ textDecorationLine: "underline" }}
        color={"blue"}
      >
        {children || value}
      </StyledText>
    </TouchableOpacity>
  );
};
