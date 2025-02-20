import React from "react";
import { Tabs } from "expo-router";
import { Home3, ChartSquare, Briefcase, User } from "iconsax-react-native";
import { StatusBar } from "expo-status-bar";

import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import { ChatProvider } from "@/src/context/ChatContext";
import TawkToChat from "@/src/components/AppChatBox";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <ChatProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { minHeight: 70, paddingTop: 10, paddingBottom: 15 },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarLabel: ({ focused, color }) => (
                <StyledText
                  variant={focused ? "medium" : "regular"}
                  type="label"
                  color={Colors.primary}
                  style={{ marginBottom: 5 }}
                >
                  Home
                </StyledText>
              ),
              tabBarIcon: ({ size, color, focused }) => (
                <Home3
                  size={size}
                  color={focused ? Colors.primary : Colors.light}
                  variant="Bold"
                  // style={{marginTop: 10}}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="products"
            options={{
              tabBarLabel: ({ focused, color }) => (
                <StyledText
                  variant={focused ? "medium" : "regular"}
                  type="label"
                  color={Colors.primary}
                  style={{ marginBottom: 5 }}
                >
                  Invest
                </StyledText>
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <ChartSquare
                  color={focused ? Colors.primary : Colors.light}
                  size={size}
                  variant="Bold"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="portfolio"
            options={{
              tabBarLabel: ({ focused, color }) => (
                <StyledText
                  variant={focused ? "semibold" : "regular"}
                  type="label"
                  color={Colors.primary}
                  style={{ marginBottom: 5 }}
                >
                  Portfolio
                </StyledText>
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <Briefcase
                  color={focused ? Colors.primary : Colors.light}
                  size={size}
                  variant="Bold"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarLabel: ({ focused, color }) => (
                <StyledText
                  variant={focused ? "medium" : "regular"}
                  type="label"
                  color={Colors.primary}
                  style={{ marginBottom: 5 }}
                >
                  Profile
                </StyledText>
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <User
                  color={focused ? Colors.primary : Colors.light}
                  size={size}
                  variant="Bold"
                />
              ),
            }}
          />
        </Tabs>
        <TawkToChat />
      </ChatProvider>
    </>
  );
}
