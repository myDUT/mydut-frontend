import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CheckBox } from "rn-inkpad";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { fetchRole } from "../../api/role_api";
import { addNewUser } from "../../api/user_api";
import SplashScreen from "../SplashScreen";
import Toast from "react-native-toast-message";

export default function Register() {
  const navigation = useNavigation();
  const { top: paddingTop } = useSafeAreaInsets();

  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    fullName: Yup.string().required("Fullname is required"),
    password: Yup.string().required("Password is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    isLecturer: Yup.boolean(),
    studentCode: Yup.string(),
    homeroomClass: Yup.string(),
  });

  useEffect(() => {
    fetchRole()
      .then((response) => {
        return setRoles(response.data.data);
      })
      .catch((error) => {
        console.log("🚀 ~ useEffect ~ error:", error);
      });
  }, []);

  const showSuccessCreateUserToast = () => {
    Toast.show({
      type: "success",
      text1: "Notification",
      text2: "Create new user successfully.",
    });
  };

  const showFailedCreateUser = () => {
    Toast.show({
      type: "error",
      text1: "Notification",
      text2: "An error has occurred. Please try again later.",
    });
  };

  const handleAddNewUser = async (values) => {
    setIsLoading(true);
    const roleId = values.isLecturer
      ? roles?.find((role) => role.roleName === "TEACHER").roleId
      : roles?.find((role) => role.roleName === "STUDENT").roleId;

    const data = { ...values, roleId };
    delete data.isLecturer;

    await addNewUser(data)
      .then((response) => {
        if (response.status == 200) {
          showSuccessCreateUserToast();
          setIsLoading(false);
          navigation.navigate("Login");
        } else {
          setIsLoading(false);
          showFailedCreateUser();
        }
      })
      .catch((error) => {
        console.log("🚀 ~ handleLogin ~ error:", error);
        setIsLoading(false);
        showFailedCreateUser();
      });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.btnBack}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={"#000000"}
          style={{ fontWeight: "600" }}
        />
      </TouchableOpacity>
      <Text style={styles.txtLogin}>Register</Text>
      <Text style={styles.txtDescription}>
        Enter your information to register
      </Text>
      <Formik
        initialValues={{
          username: "",
          fullName: "",
          password: "",
          email: "",
          isLecturer: false,
          studentCode: "",
          homeroomClass: "",
        }}
        onSubmit={handleAddNewUser}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View>
            {/* Username */}
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
            {errors.username && touched.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Fullname */}
            <TextInput
              style={styles.input}
              placeholder="Fullname"
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              value={values.fullName}
            />
            {errors.fullName && touched.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

            {/* Password */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Email */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Checkbox */}
            <CheckBox
              checked={values.isLecturer}
              iconColor={"#f78a32"}
              iconSize={25}
              style={styles.checkboxLecturer}
              onChange={() => {
                setFieldValue("isLecturer", !values.isLecturer);
                setFieldValue("studentCode", "");
                setFieldValue("homeroomClass", "");
              }}
              title={"Are you a lecturer?"}
            />

            {!values.isLecturer && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Student code"
                  onChangeText={handleChange("studentCode")}
                  value={values.studentCode}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Homeroom class"
                  onChangeText={handleChange("homeroomClass")}
                  value={values.homeroomClass}
                />
              </>
            )}

            <TouchableOpacity style={styles.bthLogin} onPress={handleSubmit}>
              <Text style={styles.bthLoginText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View style={styles.viewRegister}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.bthRegister}>Login</Text>
        </TouchableOpacity>
      </View>
      <SplashScreen isDisplay={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  btnBack: {
    marginLeft: -12,
    marginTop: 12,
    marginBottom: 16,
  },
  txtLogin: {
    fontSize: 30,
    fontWeight: "700",
  },
  txtDescription: {
    marginTop: 12,
  },
  input: {
    height: 45,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  checkboxLecturer: {
    marginTop: 12,
  },
  bthLogin: {
    marginTop: 24,
    backgroundColor: "#f78a32",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bthLoginText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  viewRegister: {
    flexDirection: "row",
    marginTop: 12,
    gap: 6,
    justifyContent: "center",
  },
  bthRegister: {
    color: "#f78a32",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginLeft: 5,
  },
});
