import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AppDropdown = ({ options, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  const selectOption = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="chevron-down" size={25} />
        <Text style={styles.text}>
          {selectedOption ? selectedOption.label : options[0].label}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        // style={{ position: "absolute", top: 0, left: 15 }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => selectOption(item)}
                >
                  <Text style={styles.text}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  dropdownButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  modalOverlay: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  modalContent: {
    // alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 4,
    // position: "absolute",
    padding: 20,
    // top: 100,
    // left: 15,
    width: 100,
  },
  option: {
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default AppDropdown;
