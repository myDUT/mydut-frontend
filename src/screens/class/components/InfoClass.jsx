import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  formatTimestamp,
  formatTimestampToHHmm,
} from "../../../utils/DateUtils";

export default function InfoClass({ onFormSubmit, initFormData }) {
  const dataRoom = [
    { label: "F304", value: "1" },
    { label: "E101", value: "2" },
    { label: "E102", value: "3" },
    { label: "E103", value: "4" },
    { label: "E201", value: "5" },
    { label: "E202", value: "6" },
    { label: "E203", value: "7" },
    { label: "H102", value: "8" },
  ];

  const dataDayOfWeek = [
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "7" },
  ];

  const [isFocusDDRoom, setIsFocusDDRoom] = useState(false);
  const [isFocusDDDay, setIsFocusDDDay] = useState(false);

  const [isPickerVisible, setPickerVisible] = useState(null);

  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // State store date from/to & date from/to
  const [formData, setFormData] = useState(
    initFormData || {
      name: "",
      classcode: "",
      room: "",
      dayofweek: "",
      timefrom: null,
      timeto: null,
      datefrom: null,
      dateto: null,
    }
  );

  const showPicker = (mode, type) => {
    setSelectedMode(mode);
    setSelectedType(type);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  useEffect(() => {
    console.log("🚀 ~ InfoClass ~ formData:", formData);
  }, []);

  useEffect(() => {
    if (onFormSubmit) {
      onFormSubmit(formData);
    }
  }, [formData]);

  const handleDateTimeConfirm = (date) => {
    let key = `` + selectedMode + selectedType;
    setFormData({ ...formData, [key]: date.getTime() });
    hidePicker();
  };

  const handleChange = (key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const renderDateTimePicker = (mode, type) => {
    return (
      <DateTimePickerModal
        isVisible={
          isPickerVisible && selectedMode === mode && selectedType === type
        }
        mode={mode}
        date={new Date()}
        onConfirm={handleDateTimeConfirm}
        onCancel={hidePicker}
      />
    );
  };
  return (
    <View style={styles.viewBody}>
      <View style={styles.viewTxtInput}>
        <Text style={styles.txtLabel}>Name</Text>
        <TextInput
          placeholder={"Ex: Hoc may va Ung dung"}
          style={styles.txtInput}
          value={formData.name}
          onChangeText={(name) => handleChange("name", name)}
        ></TextInput>
      </View>
      <View style={styles.viewTxtInput}>
        <Text style={styles.txtLabel}>Classcode</Text>
        <TextInput
          placeholder={"Ex: HMUDS12024"}
          style={styles.txtInput}
          value={formData.classcode}
          onChangeText={(classcode) => handleChange("classcode", classcode)}
        />
      </View>
      <View style={styles.viewRoomAndDay}>
        <View style={styles.viewDropDown}>
          {/* {renderLabel()} */}
          <Dropdown
            style={[
              styles.dropdown,
              isFocusDDRoom && { borderColor: "#4DC591" },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataRoom}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusDDRoom ? "Select room" : "..."}
            searchPlaceholder="Search..."
            value={formData.room}
            onFocus={() => setIsFocusDDRoom(true)}
            onBlur={() => setIsFocusDDRoom(false)}
            onChange={(item) => {
              handleChange("room", item.value);
              setIsFocusDDRoom(false);
            }}
            renderLeftIcon={() => (
              <Ionicons
                style={styles.icon}
                color={isFocusDDRoom ? "#4DC591" : "black"}
                name="location-outline"
                size={24}
              />
            )}
          />
        </View>
        {/* <View style={{ flex: 0.1 }}></View> */}
        <View style={styles.viewDropDown}>
          {/* {renderLabel()} */}
          <Dropdown
            style={[
              styles.dropdown,
              isFocusDDDay && { borderColor: "#4DC591" },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataDayOfWeek}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusDDDay ? "Choose a day" : "..."}
            value={formData["dayofweek"]}
            onFocus={() => setIsFocusDDDay(true)}
            onBlur={() => setIsFocusDDDay(false)}
            onChange={(item) => {
              handleChange("dayofweek", item.value);
              setIsFocusDDDay(false);
            }}
            renderLeftIcon={() => (
              <Ionicons
                style={styles.icon}
                color={isFocusDDDay ? "#4DC591" : "black"}
                name="menu-outline"
                size={24}
              />
            )}
          />
        </View>
      </View>
      <View>
        <Text style={styles.txtLabel}>Time</Text>
        <View style={styles.viewTime}>
          <TouchableOpacity
            style={styles.btnDateFrom}
            onPress={() => showPicker("time", "from")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>From</Text>
              <Text style={{ fontSize: 18 }}>
                {formData["timefrom"] != null
                  ? formatTimestampToHHmm(formData["timefrom"])
                  : ""}
              </Text>
              <Ionicons
                style={styles.icon}
                color={"#666666"}
                name="alarm-outline"
                size={24}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnDateTo}
            onPress={() => showPicker("time", "to")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>To</Text>
              <Text style={{ fontSize: 18 }}>
                {formData["timeto"] != null
                  ? formatTimestampToHHmm(formData["timeto"])
                  : ""}
              </Text>
              <Ionicons
                style={styles.icon}
                color={"#666666"}
                name="alarm-outline"
                size={24}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.txtLabel}>Date</Text>
        <View style={styles.viewTime}>
          <TouchableOpacity
            style={styles.btnDateFrom}
            onPress={() => showPicker("date", "from")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>From</Text>
              <Text style={{ fontSize: 16 }}>
                {formData["datefrom"] != null
                  ? formatTimestamp(formData["datefrom"], "L")
                  : ""}
              </Text>
              <Ionicons
                style={styles.icon}
                color={"#666666"}
                name="calendar-outline"
                size={24}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnDateTo}
            onPress={() => showPicker("date", "to")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>To</Text>
              <Text style={{ fontSize: 16 }}>
                {formData["dateto"] != null
                  ? formatTimestamp(formData["dateto"], "L")
                  : ""}
              </Text>
              <Ionicons
                style={styles.icon}
                color={"#666666"}
                name="calendar-outline"
                size={24}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {renderDateTimePicker("time", "from")}
      {renderDateTimePicker("time", "to")}
      {renderDateTimePicker("date", "from")}
      {renderDateTimePicker("date", "to")}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    gap: 12,
  },
  viewTxtInput: {
    gap: 3,
    // marginTop: 3,
  },
  txtInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  // Style DropDown
  viewRoomAndDay: {
    flexDirection: "row",
    gap: 12,
  },

  viewDropDown: {
    // backgroundColor: "white",
    // padding: 16,
    marginTop: 10,
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  viewTime: {
    // flex: 1,
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
  },
  btnDateFrom: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  btnDateTo: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  labelPicker: {
    paddingLeft: 6,
    marginTop: -12,
    color: "#848586",
  },
  viewPicker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
