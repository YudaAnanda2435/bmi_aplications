import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import Button from "../../elements/buttons/Button";
import ActionLoadingModal from "../../elements/feedback/ActionLoadingModal";
import Alert from "../../elements/feedback/Alert";
import ConfirmDialog from "../../elements/feedback/ConfirmDialog";
import TableSkeleton from "../../elements/loading/TableSkeleton";
import EmptyState from "../../elements/tables/EmptyState";
import ResidentImportModal from "./ResidentImportModal";
import { ROUTES } from "../../../constants/routes";
import {
  PAGE_TABLE_PANEL_CLASS,
  PAGE_TABLE_SECTION_CLASS,
} from "../../../constants/tableLayout";
import { genderOptions } from "../../../constants/options";
import importService from "../../../services/importService";
import residentService from "../../../services/residentService";
import { formatNumber } from "../../../utils/formatters";
import { showError, showSuccess } from "../../../utils/toast";

const ITEMS_PER_PAGE = 20;

function formatHeightCm(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numericValue = Number(value);
  const heightInCm = numericValue > 0 && numericValue <= 3 ? numericValue * 100 : numericValue;

  return Number(heightInCm).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  });
}

function getGenderLabel(value) {
  return genderOptions.find((option) => option.value === value)?.label || value || "-";
}

function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "?";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getBmiTone(value) {
  const bmi = Number(value);

  if (!bmi) {
    return "bg-[#e1e3e4] text-[#42493f]";
  }

  if (bmi >= 30) {
    return "bg-[#ffdad6] text-[#f44336]";
  }

  if (bmi >= 25) {
    return "bg-orange-100 text-orange-700";
  }

  if (bmi < 18.5) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-[#e1e3e4] text-[#42493f]";
}

export default function ResidentTable() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [residentToDelete, setResidentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isTemplateDownloading, setIsTemplateDownloading] = useState(false);

  async function loadResidents() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await residentService.getResidents({ limit: 500 });
      setResidents(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      setErrorMessage(error.message);
      showError("Data gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResidents();
  }, []);

  async function handleDelete() {
    if (!residentToDelete) {
      return;
    }

    const resident = residentToDelete;
    setResidentToDelete(null);
    setDeletingId(resident.id);
    setErrorMessage("");

    try {
      await residentService.deleteResident(resident.id);
      setResidents((current) =>
        current.filter((item) => item.id !== resident.id)
      );
      showSuccess("Data penduduk berhasil dihapus.");
    } catch (error) {
      setErrorMessage(error.message);
      showError("Data penduduk gagal dihapus.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDownloadTemplate() {
    setIsTemplateDownloading(true);
    setErrorMessage("");

    try {
      await importService.downloadImportTemplate();
      showSuccess("Template berhasil diunduh.");
    } catch (error) {
      setErrorMessage(error.message);
      showError("Template gagal diunduh.");
    } finally {
      setIsTemplateDownloading(false);
    }
  }

  const filteredResidents = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return residents;
    }

    return residents.filter((resident) =>
      resident.name?.toLowerCase().includes(keyword)
    );
  }, [residents, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentResidents = useMemo(
    () => filteredResidents.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredResidents, startIndex]
  );
  const visibleStart = filteredResidents.length ? startIndex + 1 : 0;
  const visibleEnd = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredResidents.length
  );
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <TableSkeleton columns={7} rows={8} className="min-h-[520px]" />
      </section>
    );
  }

  return (
    <section className={PAGE_TABLE_SECTION_CLASS}>
      <div className="mb-4 flex shrink-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari nama penduduk..."
            className="w-full rounded-lg border border-[#c2c9bc] bg-[#f8f9fa] py-2.5 pl-10 pr-4 text-sm text-[#191c1d] outline-none transition placeholder:text-[#64748b] focus:border-[#3a6936] focus:ring-1 focus:ring-[#3a6936]"
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownloadTemplate}
            disabled={isTemplateDownloading}
            className="w-full rounded-lg px-5 py-2.5 text-sm sm:w-auto"
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Download Template
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsImportOpen(true)}
            className="w-full rounded-lg px-5 py-2.5 text-sm sm:w-auto"
          >
            <Upload aria-hidden="true" className="h-4 w-4" />
            Import Excel
          </Button>
          <Button
            onClick={() => navigate(ROUTES.residentCreate)}
            className="w-full rounded-lg bg-[#3a6936] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2f572d] sm:w-auto"
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Tambah Penduduk
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <Alert
          variant="danger"
          title="Data penduduk gagal dimuat"
          message={errorMessage}
          className="mb-4 shrink-0"
        />
      ) : null}

      <div
        className={[
          PAGE_TABLE_PANEL_CLASS,
          "rounded-xl border border-[#e1e3e4]/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
        ].join(" ")}
      >
        {filteredResidents.length ? (
          <>
            <div className="min-h-0 w-full flex-1 overflow-auto">
              <table className="w-full min-w-[800px] table-auto border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#c2c9bc]/30 bg-[#f3f4f5]">
                    <th className="px-4 py-3 text-sm font-semibold text-[#42493f]">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-[#42493f]">
                      Jenis Kelamin
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[#42493f]">
                      Usia
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[#42493f]">
                      Tinggi (cm)
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[#42493f]">
                      Berat (kg)
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-[#42493f]">
                      BMI
                    </th>
                    <th className="min-w-[180px] px-4 py-3 text-right text-sm font-semibold text-[#42493f]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c2c9bc]/20">
                  {currentResidents.map((resident) => (
                    <tr
                      key={resident.id}
                      className="group transition-colors hover:bg-[#f3f4f5]/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4e8d5] text-sm font-bold text-[#57695a]">
                            {getInitials(resident.name)}
                          </div>
                          <span className="text-base font-medium text-[#191c1d]">
                            {resident.name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#52637f]">
                        {getGenderLabel(resident.gender)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-[#52637f]">
                        {formatNumber(resident.age)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-[#52637f]">
                        {formatHeightCm(resident.height)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-[#52637f]">
                        {formatNumber(resident.weight)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={[
                            "inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            getBmiTone(resident.bmi),
                          ].join(" ")}
                        >
                          {formatNumber(resident.bmi)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* <button
                            type="button"
                            title="Detail"
                            onClick={() => navigate(ROUTES.residentDetail(resident.id))}
                            className="rounded-md bg-[#3a6936]/10 p-1.5 text-[#3a6936] transition hover:bg-[#3a6936]/20"
                          >
                            <Eye aria-hidden="true" className="h-4 w-4" />
                          </button> */}
                          {/* <button
                            type="button"
                            title="Ubah"
                            onClick={() => navigate(ROUTES.residentEdit(resident.id))}
                            className="rounded-md p-1.5 text-[#52637f] transition hover:bg-[#f3f4f5] hover:text-[#3a6936]"
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                          </button> */}
                          <button
                            type="button"
                            title="Klasifikasi"
                            onClick={() =>
                              navigate(ROUTES.residentDetail(resident.id))
                            }
                            className="rounded-md bg-[#3a6936] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2f572d]"
                          >
                            Klasifikasi
                          </button>
                          <button
                            type="button"
                            title="Hapus"
                            disabled={deletingId === resident.id}
                            onClick={() => setResidentToDelete(resident)}
                            className="rounded-md p-1.5 text-[#52637f] transition hover:bg-[#ffdad6] hover:text-[#ba1a1a] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#c2c9bc]/30 bg-[#f3f4f5]/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm leading-5 flex justify-end text-[#64748b]">
                Menampilkan {visibleStart}-{visibleEnd} dari{" "}
                {filteredResidents.length} data
              </span>
              <div className="flex items-center gap-1 justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c2c9bc] text-[#42493f] transition hover:bg-[#f3f4f5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={[
                      "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition",
                      currentPage === page
                        ? "bg-[#3a6936] text-white"
                        : "border border-[#c2c9bc] text-[#42493f] hover:bg-[#f3f4f5]",
                    ].join(" ")}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c2c9bc] text-[#42493f] transition hover:bg-[#f3f4f5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center p-6">
            <EmptyState
              title={
                searchQuery
                  ? "Data penduduk tidak ditemukan"
                  : "Belum ada data penduduk"
              }
              description={
                searchQuery
                  ? "Coba gunakan kata kunci lain untuk mencari nama penduduk."
                  : "Tambahkan data penduduk terlebih dahulu sebelum menjalankan klasifikasi."
              }
              action={
                !searchQuery ? (
                  <Button onClick={() => navigate(ROUTES.residentCreate)}>
                    Tambah Penduduk
                  </Button>
                ) : null
              }
              className="border-[#c2c9bc] shadow-none"
            />
          </div>
        )}
      </div>

      <ResidentImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={loadResidents}
      />
      <ConfirmDialog
        open={Boolean(residentToDelete)}
        title="Hapus Data Penduduk?"
        message={`Data penduduk "${residentToDelete?.name || "-"}" akan dihapus dari sistem. Aksi ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setResidentToDelete(null)}
      />
      <ActionLoadingModal
        open={Boolean(deletingId) || isTemplateDownloading}
        title="Mohon tunggu..."
        message={
          isTemplateDownloading
            ? "Template sedang disiapkan..."
            : "Data penduduk sedang dihapus..."
        }
      />
    </section>
  );
}
