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

  return message || "Permintaan data penduduk gagal diproses.";
}

export async function getResidents(params) {
  try {
    const response = await apiClient.get("/api/residents", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getResident(id) {
  try {
    const response = await apiClient.get(`/api/residents/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createResident(payload) {
  try {
    const response = await apiClient.post("/api/residents", payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateResident(id, payload) {
  try {
    const response = await apiClient.put(`/api/residents/${id}`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteResident(id) {
  try {
    const response = await apiClient.delete(`/api/residents/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const residentService = {
  getResidents,
  getResident,
  createResident,
  updateResident,
  deleteResident,
};

export default residentService;
