import {
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";

import { Colors } from "@/src/constants/Colors";

const statusBarHeight = StatusBar.currentHeight;

const Screen = ({
  children,
  customStyles,
  stickyHeaderIndices,
  refreshing,
  onRefresh,
}) => {
  return (
    <>
      {Platform.OS === "android" ? (
        <>
          <View
            style={[
              styles.container,
              { paddingTop: statusBarHeight },
              customStyles,
            ]}
          >
            <KeyboardAvoidingView
              style={{ flex: 1, backgroundColor: Colors.white }}
              // behavior={"height"}
              // keyboardVerticalOffset={0}
            >
              <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing ? refreshing : false}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View style={{ flex: 1 }}>{children}</View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.container, customStyles]}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={[{ flexGrow: 1 }]}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing ? refreshing : false}
                      onRefresh={onRefresh}
                    />
                  }
                  keyboardShouldPersistTaps="handled"
                >
                  {children}
                </ScrollView>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default Screen;
