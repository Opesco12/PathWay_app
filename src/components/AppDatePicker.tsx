import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AppDatePicker = ({
  isDatePickerVisible,
  setDatePickerVisibility,
  setDate,
}) => {
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      maximumDate={new Date()}
    />
  );
};

export default AppDatePicker;
