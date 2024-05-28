import ApiManager from "./ApiManager";

export const fetchRole = async () => {
  try {
    const result = await ApiManager("/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result;
  } catch (error) {
    return error.response;
  }
};
