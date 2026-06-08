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

  return message || "Permintaan data laporan gagal diproses.";
}

export async function getReports(params) {
  try {
    const response = await apiClient.get("/api/reports", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getLatestReports(params) {
  try {
    const response = await apiClient.get("/api/reports/latest", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getReportHistory(params) {
  try {
    const response = await apiClient.get("/api/reports/history", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getReport(id) {
  try {
    const response = await apiClient.get(`/api/reports/${id}`);
    const report = response.data?.data || response.data;

    if (report?.classification) {
      return {
        ...report,
        classification: normalizePredictionResult(report.classification),
      };
    }

    return report;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

function getPdfFilename(response, id) {
  const disposition = response.headers?.["content-disposition"];
  const match = disposition?.match(/filename="?([^"]+)"?/i);

  return match?.[1] || `laporan-klasifikasi-${id}.pdf`;
}

export async function downloadReportPdf(id) {
  try {
    const response = await apiClient.get(`/api/reports/${id}/pdf`, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: "application/pdf" });

    return {
      blob,
      filename: getPdfFilename(response, id),
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const reportService = {
  getReports,
  getLatestReports,
  getReportHistory,
  getReport,
  downloadReportPdf,
};

export default reportService;
