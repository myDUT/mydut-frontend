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
import { fetchRoom } from "../../../api/room_api";

export default function InfoClass({ onFormSubmit, initFormData }) {
  const dataDayOfWeek = [
    { label: "Monday", value: 2 },
    { label: "Tuesday", value: 3 },
    { label: "Wednesday", value: 4 },
    { label: "Thursday", value: 5 },
    { label: "Friday", value: 6 },
    { label: "Saturday", value: 7 },
    { label: "Sunday", value: 1 },
  ];

  const [dataRoom, setDataRoom] = useState([]);

  const [isFocusDDRoom, setIsFocusDDRoom] = useState(false);
  const [isFocusDDDay, setIsFocusDDDay] = useState(false);

  const [isPickerVisible, setPickerVisible] = useState(null);

  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // State store date from/to & date from/to
  const [formData, setFormData] = useState(
    initFormData || {
      name: "",
      classCode: "",
      roomId: "",
      dayOfWeek: "",
      timeFrom: null,
      timeTo: null,
      dateFrom: null,
      dateTo: null,
    }
  );

  useEffect(() => {
    fetchRoom()
      .then((response) => {
        return setDataRoom(response.data.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (onFormSubmit) {
      onFormSubmit(formData);
    }
  }, [formData]);

  const showPicker = (mode, type) => {
    setSelectedMode(mode);
    setSelectedType(type);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

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
        />
      </View>
      <View style={styles.viewTxtInput}>
        <Text style={styles.txtLabel}>Classcode</Text>
        <TextInput
          placeholder={"Ex: HMUDS12024"}
          style={styles.txtInput}
          value={formData.classCode}
          onChangeText={(classCode) => handleChange("classCode", classCode)}
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
            labelField="name"
            valueField="roomId"
            placeholder={!isFocusDDRoom ? "Select room" : "..."}
            searchPlaceholder="Search..."
            value={formData.roomId}
            onFocus={() => setIsFocusDDRoom(true)}
            onBlur={() => setIsFocusDDRoom(false)}
            onChange={(item) => {
              handleChange("roomId", item.roomId);
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
            disable={initFormData}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataDayOfWeek}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusDDDay ? "Choose a day" : "..."}
            value={formData.dayOfWeek}
            onFocus={() => setIsFocusDDDay(true)}
            onBlur={() => setIsFocusDDDay(false)}
            onChange={(item) => {
              handleChange("dayOfWeek", item.value);
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
            disabled={!!initFormData}
            style={styles.btnDateFrom}
            onPress={() => showPicker("time", "From")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>From</Text>
              <Text style={{ fontSize: 18 }}>
                {formData.timeFrom != null
                  ? formatTimestampToHHmm(formData.timeFrom)
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
            disabled={!!initFormData}
            style={styles.btnDateTo}
            onPress={() => showPicker("time", "To")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>To</Text>
              <Text style={{ fontSize: 18 }}>
                {formData.timeTo != null
                  ? formatTimestampToHHmm(formData.timeTo)
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
            disabled={!!initFormData}
            style={styles.btnDateFrom}
            onPress={() => showPicker("date", "From")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>From</Text>
              <Text style={{ fontSize: 16 }}>
                {formData.dateFrom != null
                  ? formatTimestamp(formData.dateFrom, "L")
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
            disabled={!!initFormData}
            style={styles.btnDateTo}
            onPress={() => showPicker("date", "To")}
          >
            <View style={styles.viewPicker}>
              <Text style={styles.labelPicker}>To</Text>
              <Text style={{ fontSize: 16 }}>
                {formData.dateTo != null
                  ? formatTimestamp(formData.dateTo, "L")
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
      {renderDateTimePicker("time", "From")}
      {renderDateTimePicker("time", "To")}
      {renderDateTimePicker("date", "From")}
      {renderDateTimePicker("date", "To")}
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
