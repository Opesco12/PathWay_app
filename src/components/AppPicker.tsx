import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";
import { CheckBox } from "@rneui/base";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import AppDivider from "./AppDivider";

const AppPicker = ({
  onValueChange,
  placeholder,
  options = [],
  value,
  label,
  rightLabel,
  rightLabelColor,
  rightLabelStyle,
  clickable = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption =
    options !== null && options.find((option) => option.value === value);

  const handleSelect = (option) => {
    onValueChange(option.value);
    setModalVisible(false);
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <StyledText
          color={Colors.primary}
          type="label"
          variant="medium"
          style={{ marginBottom: 2 }}
        >
          {label}
        </StyledText>
        <StyledText
          color={rightLabelColor ? rightLabelColor : Colors.primary}
          type="label"
          variant="medium"
          style={[rightLabelStyle, { marginBottom: 2, fontSize: 12 }]}
        >
          {rightLabel}
        </StyledText>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.inner}
          onPress={() => clickable === true && setModalVisible(true)}
        >
          {!selectedOption ? (
            <StyledText
              color={Colors.light}
              type="title"
              variant="medium"
            >
              {placeholder}
            </StyledText>
          ) : (
            <StyledText
              color={Colors.black}
              type="title"
              variant="medium"
            >
              {selectedOption && selectedOption.label}
            </StyledText>
          )}

          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            style={{ opacity: 0.5 }}
          />
        </TouchableOpacity>
      </View>

      <ReactNativeModal
        isVisible={modalVisible}
        style={styles.modal}
        swipeThreshold={60}
        swipeDirection={"down"}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.line}></View>
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  handleSelect(item);
                }}
              >
                <StyledText
                  type="title"
                  variant="medium"
                >
                  {item.label}
                </StyledText>
                <CheckBox
                  checked={
                    selectedOption && selectedOption.value === item.value
                  }
                  onPress={() => handleSelect(item)}
                />
              </Pressable>
            )}
            ItemSeparatorComponent={() => <AppDivider />}
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: 8,
    paddingHorizontal: 15,
    height: 55,
  },
  inner: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  item: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    alignSelf: "center",
    backgroundColor: Colors.black,
    borderRadius: 3,
    opacity: 0.4,
    height: 5,
    width: 50,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: 200,
    maxHeight: "90%",
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
  },

  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default AppPicker;
