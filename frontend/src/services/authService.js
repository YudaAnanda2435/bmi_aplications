import apiClient from "./apiClient";

function translateAuthMessage(message) {
  if (message === "Email already registered") {
    return "Email sudah terdaftar.";
  }

  if (message === "Invalid email or password") {
    return "Email atau password salah.";
  }

  return message;
}

function getErrorMessage(error, fallbackMessage) {
  const response = error.response?.data;
  const detail = response?.detail;
  const message = response?.message;
  const errors = response?.data?.errors;

  if (typeof detail === "string") {
    return translateAuthMessage(detail);
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => item?.msg || item?.message || item)
      .filter(Boolean)
      .join(", ");
  }

  if (detail?.message) {
    return translateAuthMessage(detail.message);
  }

  if (Array.isArray(errors) && errors.length > 0) {
    return errors
      .map((item) => item?.msg || item?.message || item)
      .filter(Boolean)
      .join(", ");
  }

  return translateAuthMessage(message || fallbackMessage);
}

export async function login(payload) {
  try {
    const response = await apiClient.post("/api/auth/login", payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login gagal. Periksa email dan password."));
  }
}

export async function register(payload) {
  try {
    const response = await apiClient.post("/api/auth/register", payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Registrasi gagal. Periksa data yang diisi."));
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.get("/api/auth/me");
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Gagal memuat data pengguna."));
  }
}

const authService = {
  login,
  register,
  getCurrentUser,
};

export default authService;
