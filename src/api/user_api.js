import ApiManager from "./ApiManager";

export const UserLogin = async (data) => {
  console.log("🚀 ~ constuser_login= ~ data:", data);
  try {
    const result = await ApiManager("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    });
    return result;
  } catch (error) {
    // console.log("🚀 ~ constuser_login= ~ error:", error)
    return error.response.data;
  }
};

export const AddNewUser = async (data) => {
  try {
    const result = await ApiManager("/users/add-new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });
    return result;
  } catch (error) {
    // console.log("🚀 ~ constuser_login= ~ error:", error)
    return error.response.data;
  }
};
