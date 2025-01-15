import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../constants/Colors";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

const AppMonthPicker = ({ isVisible, onClose, onSelectMonthYear }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const monthScrollViewRef = useRef(null);
  const yearScrollViewRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      monthScrollViewRef.current?.scrollTo({
        y: selectedMonth * ITEM_HEIGHT,
        animated: false,
      });
      yearScrollViewRef.current?.scrollTo({
        y: (selectedYear - years[0]) * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [isVisible, selectedMonth, selectedYear]);

  const handleScroll = (event, setter, items) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    setter(items[index]);
  };

  const handleMonthScroll = (event) =>
    handleScroll(
      event,
      setSelectedMonth,
      months.map((_, i) => i)
    );
  const handleYearScroll = (event) =>
    handleScroll(event, setSelectedYear, years);

  const renderPickerItems = (items) => {
    return items.map((item, index) => (
      <View
        key={index}
        style={styles.pickerItem}
      >
        <Text style={styles.pickerItemText}>{item}</Text>
      </View>
    ));
  };

  const handleConfirm = () => {
    const selectedMonthName = months[selectedMonth];
    if (typeof onSelectMonthYear === "function") {
      onSelectMonthYear(selectedMonthName, selectedYear);
    }
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.pickerContainer}>
            <ScrollView
              ref={monthScrollViewRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              onMomentumScrollEnd={handleMonthScroll}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
            >
              {renderPickerItems(months)}
            </ScrollView>
            <ScrollView
              ref={yearScrollViewRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              onMomentumScrollEnd={handleYearScroll}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
            >
              {renderPickerItems(years)}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AppMonthPicker;
