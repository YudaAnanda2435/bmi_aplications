import { useMemo, useRef, useState } from "react";
import { Download, FileSpreadsheet, Upload, X } from "lucide-react";
import Button from "../../elements/buttons/Button";
import ActionLoadingModal from "../../elements/feedback/ActionLoadingModal";
import Alert from "../../elements/feedback/Alert";
import { residentFieldLabels } from "../../../constants/labels";
import importService from "../../../services/importService";
import { formatNumber } from "../../../utils/formatters";
import { showError, showSuccess } from "../../../utils/toast";

function getErrorRows(preview) {
  return preview?.errors || [];
}

function getValidRows(preview) {
  return preview?.preview_valid_data || preview?.valid_rows || [];
}

function getFieldLabel(field) {
  return residentFieldLabels[field] || field || "-";
}

function getPreviewStats(preview) {
  const validRows = getValidRows(preview);
  const errorRows = getErrorRows(preview);

  return {
    totalRows: preview?.total_rows ?? validRows.length + errorRows.length,
    validCount: preview?.valid_count ?? validRows.length,
    errorCount: preview?.error_count ?? errorRows.length,
  };
}

function getResultStats(result) {
  return {
    totalRows: result?.total_rows ?? 0,
    importedCount: result?.imported_count ?? 0,
    failedCount: result?.failed_count ?? 0,
    classDistribution: result?.class_distribution || {},
    warningDistribution: result?.warning_distribution || {},
  };
}

function StatPill({ label, value, tone = "neutral" }) {
  const tones = {
    neutral: "bg-[#f3f4f5] text-[#42493f]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  };

  return (
    <div className={["rounded-lg px-4 py-3", tones[tone]].join(" ")}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-xl font-bold">{formatNumber(value)}</p>
    </div>
  );
}

function DistributionList({ title, data }) {
  const entries = Object.entries(data || {});

  return (
    <div className="rounded-lg border border-[#e7e8e9] bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-[#1a1a1a]">{title}</h4>
      {entries.length ? (
        <div className="space-y-2">
          {entries.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 text-sm text-[#52637f]"
            >
              <span>{label}</span>
              <span className="font-semibold text-[#1a1a1a]">
                {formatNumber(value)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#64748b]">Belum ada data.</p>
      )}
    </div>
  );
}

function ValidRowsTable({ rows }) {
  return (
    <div className="max-h-72 min-h-0 overflow-auto rounded-lg border border-[#e7e8e9]">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-[#f3f4f5] text-[#42493f]">
          <tr>
            <th className="px-4 py-3 font-semibold">Nama</th>
            <th className="px-4 py-3 font-semibold">Jenis Kelamin</th>
            <th className="px-4 py-3 text-center font-semibold">Usia</th>
            <th className="px-4 py-3 text-center font-semibold">Tinggi Badan</th>
            <th className="px-4 py-3 text-center font-semibold">Berat Badan</th>
            <th className="px-4 py-3 text-center font-semibold">BMI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e7e8e9] text-[#1a1a1a]">
          {rows.map((row, index) => (
            <tr key={`${row.name || "row"}-${index}`}>
              <td className="px-4 py-3 font-medium">{row.name || "-"}</td>
              <td className="px-4 py-3">{row.gender || "-"}</td>
              <td className="px-4 py-3 text-center">{formatNumber(row.age)}</td>
              <td className="px-4 py-3 text-center">
                {formatNumber(row.height)}
              </td>
              <td className="px-4 py-3 text-center">
                {formatNumber(row.weight)}
              </td>
              <td className="px-4 py-3 text-center">{formatNumber(row.bmi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorRowsTable({ rows }) {
  return (
    <div className="max-h-72 min-h-0 overflow-auto rounded-lg border border-[#ffdad6]">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead className="bg-red-50 text-red-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Baris</th>
            <th className="px-4 py-3 font-semibold">Field</th>
            <th className="px-4 py-3 font-semibold">Pesan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-red-100 text-[#1a1a1a]">
          {rows.map((row, index) => (
            <tr key={`${row.row_number || "error"}-${row.field || index}`}>
              <td className="px-4 py-3">{row.row_number || "-"}</td>
              <td className="px-4 py-3">{getFieldLabel(row.field)}</td>
              <td className="px-4 py-3">{row.message || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResidentImportModal({ isOpen, onClose, onImportSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const validRows = useMemo(() => getValidRows(preview), [preview]);
  const errorRows = useMemo(() => getErrorRows(preview), [preview]);
  const previewStats = getPreviewStats(preview);
  const resultStats = getResultStats(importResult);
  const canImport = Boolean(selectedFile && preview && previewStats.validCount > 0);

  if (!isOpen) {
    return null;
  }

  function validateSelectedFile(file) {
    if (!file) {
      return "Pilih file Excel terlebih dahulu.";
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      return "File harus berformat .xlsx.";
    }

    return "";
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
    setPreview(null);
    setImportResult(null);
    setErrorMessage(file ? validateSelectedFile(file) : "");
  }

  async function handleDownloadTemplate() {
    setIsDownloading(true);
    setErrorMessage("");

    try {
      await importService.downloadImportTemplate();
      showSuccess("Template berhasil diunduh.");
    } catch (error) {
      setErrorMessage(error.message);
      showError("Template gagal diunduh.");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handlePreview() {
    const validationMessage = validateSelectedFile(selectedFile);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      showError(validationMessage);
      return;
    }

    setIsPreviewing(true);
    setErrorMessage("");
    setPreview(null);
    setImportResult(null);

    try {
      const data = await importService.previewResidentImport(selectedFile);
      setPreview(data);
      showSuccess("File berhasil divalidasi.");
    } catch (error) {
      setErrorMessage(error.message);
      showError("File gagal divalidasi.");
    } finally {
      setIsPreviewing(false);
    }
  }

  async function handleImportAndClassify() {
    const validationMessage = validateSelectedFile(selectedFile);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      showError(validationMessage);
      return;
    }

    if (!canImport) {
      setErrorMessage("Tidak ada data valid untuk disimpan.");
      showError("Tidak ada data valid untuk disimpan.");
      return;
    }

    setIsImporting(true);
    setErrorMessage("");

    try {
      const data = await importService.importAndClassifyResidents(selectedFile);
      setImportResult(data);
      showSuccess("Data berhasil diimport dan diklasifikasikan.");
      await onImportSuccess?.();
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
      showError("Data gagal diimport.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e7e8e9] px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">
              Import Data Penduduk
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#64748b]">
              Upload File Excel untuk menambahkan data penduduk sekaligus
              menjalankan klasifikasi massal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#64748b] transition hover:bg-[#f3f4f5] hover:text-[#1a1a1a]"
            aria-label="Tutup modal import"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {errorMessage ? (
            <Alert
              variant="danger"
              title="Import data penduduk gagal"
              message={errorMessage}
              className="mb-5"
            />
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label
                htmlFor="resident-import-file"
                className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
              >
                Upload File Excel
              </label>
              <input
                ref={fileInputRef}
                id="resident-import-file"
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="block w-full rounded-lg border border-[#c2c9bc] bg-[#f8f9fa] px-4 py-2.5 text-sm text-[#191c1d] file:mr-4 file:rounded-md file:border-0 file:bg-[#d4e8d5] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#1b491a] focus:border-[#3a6936] focus:outline-none focus:ring-1 focus:ring-[#3a6936]"
              />
              <p className="mt-2 text-xs text-[#64748b]">
                Gunakan template agar format kolom sesuai dengan sistem.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download Template
              </Button>
              <Button
                type="button"
                onClick={handlePreview}
                disabled={isPreviewing}
                className="bg-[#3a6936] hover:bg-[#2f572d]"
              >
                <Upload aria-hidden="true" className="h-4 w-4" />
                Preview Data
              </Button>
            </div>
          </div>

          {preview ? (
            <div className="mt-6 space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <StatPill label="Total Data" value={previewStats.totalRows} />
                <StatPill
                  label="Data Valid"
                  value={previewStats.validCount}
                  tone="success"
                />
                <StatPill
                  label="Data Bermasalah"
                  value={previewStats.errorCount}
                  tone={previewStats.errorCount ? "danger" : "neutral"}
                />
              </div>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1a1a1a]">
                  <FileSpreadsheet aria-hidden="true" className="h-5 w-5" />
                  Data Valid
                </h3>
                {validRows.length ? (
                  <div className="max-h-72 overflow-hidden">
                    <ValidRowsTable rows={validRows} />
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#e7e8e9] bg-[#f8f9fa] p-4 text-sm text-[#64748b]">
                    Belum ada data valid.
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-3 text-lg font-semibold text-[#1a1a1a]">
                  Data Bermasalah
                </h3>
                {errorRows.length ? (
                  <div className="max-h-72 overflow-hidden">
                    <ErrorRowsTable rows={errorRows} />
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#e7e8e9] bg-emerald-50 p-4 text-sm text-emerald-700">
                    Tidak ada data bermasalah.
                  </div>
                )}
              </section>
            </div>
          ) : null}

          {importResult ? (
            <section className="mt-6 rounded-xl border border-[#d4e8d5] bg-[#f8f9fa] p-5">
              <h3 className="mb-4 text-lg font-semibold text-[#1a1a1a]">
                Ringkasan Import
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <StatPill label="Total Data" value={resultStats.totalRows} />
                <StatPill
                  label="Berhasil Diimport"
                  value={resultStats.importedCount}
                  tone="success"
                />
                <StatPill
                  label="Gagal Diproses"
                  value={resultStats.failedCount}
                  tone={resultStats.failedCount ? "danger" : "neutral"}
                />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <DistributionList
                  title="Distribusi Hasil Klasifikasi"
                  data={resultStats.classDistribution}
                />
                <DistributionList
                  title="Distribusi Peringatan Dini"
                  data={resultStats.warningDistribution}
                />
              </div>
            </section>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-[#e7e8e9] bg-[#f8f9fa] px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button
            type="button"
            onClick={handleImportAndClassify}
            disabled={!canImport || isImporting}
            className="bg-[#3a6936] hover:bg-[#2f572d]"
          >
            Simpan dan Klasifikasikan
          </Button>
        </div>
      </div>
      <ActionLoadingModal
        open={isDownloading || isPreviewing || isImporting}
        title="Mohon tunggu..."
        message={
          isDownloading
            ? "Template sedang disiapkan..."
            : isPreviewing
              ? "File Excel sedang divalidasi..."
              : "Data sedang diimport dan diklasifikasikan..."
        }
      />
    </div>
  );
}
