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

  return message || "Gagal memuat ringkasan dashboard.";
}

export async function getSummary() {
  try {
    const response = await apiClient.get("/api/dashboard/summary");
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const dashboardService = {
  getSummary,
};

export default dashboardService;
