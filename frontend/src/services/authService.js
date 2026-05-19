import apiClient from "./apiClient";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;
  const message = error.response?.data?.message;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail?.message) {
    return detail.message;
  }

  return message || "Login gagal. Periksa email dan password.";
}

export async function login(payload) {
  try {
    const response = await apiClient.post("/api/auth/login", payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const authService = {
  login,
};

export default authService;
