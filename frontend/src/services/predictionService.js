import apiClient from "./apiClient";
import { normalizePredictionResult } from "../utils/predictionNormalizer";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;
  const message = error.response?.data?.message;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail?.message) {
    return detail.message;
  }

  return message || "Proses klasifikasi gagal diproses.";
}

export async function predictRaw(payload) {
  try {
    const response = await apiClient.post("/api/predictions/predict", payload);
    return normalizePredictionResult(response.data?.data || response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function predictResident(id) {
  try {
    const response = await apiClient.post(`/api/predictions/residents/${id}`);
    return normalizePredictionResult(response.data?.data || response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const predictionService = {
  predictRaw,
  predictResident,
};

export default predictionService;
