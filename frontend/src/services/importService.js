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

  return message || "Permintaan import data penduduk gagal diproses.";
}

function getFilename(disposition) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || "template_import_data_penduduk.xlsx";
}

function buildFilePayload(file) {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

export async function downloadImportTemplate() {
  try {
    const response = await apiClient.get("/api/residents/import-template", {
      responseType: "blob",
    });
    const filename = getFilename(response.headers["content-disposition"]);
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function previewResidentImport(file) {
  try {
    const response = await apiClient.post(
      "/api/residents/import-preview",
      buildFilePayload(file),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function importAndClassifyResidents(file) {
  try {
    const response = await apiClient.post(
      "/api/residents/import-classify",
      buildFilePayload(file),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const importService = {
  downloadImportTemplate,
  previewResidentImport,
  importAndClassifyResidents,
};

export default importService;
