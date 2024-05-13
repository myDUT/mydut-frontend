import ApiManager from "./ApiManager";

export const get_roles = async () => {
  try {
    const result = await ApiManager("/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result;
  } catch (error) {
    // console.log("🚀 ~ constuser_login= ~ error:", error)
    return error.response.data;
  }
};
