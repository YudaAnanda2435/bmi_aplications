import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Info,
} from "lucide-react";
import Alert from "../../elements/feedback/Alert";
import TableSkeleton from "../../elements/loading/TableSkeleton";
import EmptyState from "../../elements/tables/EmptyState";
import { ROUTES } from "../../../constants/routes";
import {
  PAGE_TABLE_PANEL_CLASS,
  PAGE_TABLE_SECTION_CLASS,
} from "../../../constants/tableLayout";
import reportService from "../../../services/reportService";
import { formatDateTime, formatNumber } from "../../../utils/formatters";
import { showError } from "../../../utils/toast";
import { getDietPattern } from "../predictions/predictionDisplay";

const classStyles = {
  Normal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Underweight: "bg-sky-50 text-sky-700 ring-sky-200",
  Overweight: "bg-orange-50 text-orange-700 ring-orange-200",
  Obesity: "bg-red-50 text-red-700 ring-red-200",
};

const ITEMS_PER_PAGE = 20;

const warningStyles = {
  Aman: {
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  "Perlu Perhatian": {
    className: "bg-amber-50 text-amber-700",
    icon: AlertTriangle,
  },
  "Risiko Tinggi": {
    className: "bg-red-50 text-red-700",
    icon: CircleAlert,
  },
};

function getReportId(report) {
  return report.classification_id || report.id;
}

function ClassificationBadge({ value }) {
  const style = classStyles[value] || "bg-[#e1e3e4] text-[#42493f]";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
        "ring-1 ring-inset",
        style,
      ].join(" ")}
    >
      {value || "-"}
    </span>
  );
}

function EarlyWarningBadge({ value }) {
  const config = warningStyles[value] || {
    className: "bg-[#e1e3e4] text-[#42493f]",
    icon: Info,
  };
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        config.className,
      ].join(" ")}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {value || "-"}
    </span>
  );
}

export default function ClassificationHistoryTable() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await reportService.getReportHistory({ limit: 500 });

        if (isMounted) {
          setReports(Array.isArray(data) ? data : []);
          setCurrentPage(1);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
          showError("Data gagal dimuat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(reports.length / ITEMS_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = useMemo(
    () => reports.slice(pageStartIndex, pageStartIndex + ITEMS_PER_PAGE),
    [pageStartIndex, reports]
  );
  const visibleStart = reports.length ? pageStartIndex + 1 : 0;
  const visibleEnd = Math.min(pageStartIndex + ITEMS_PER_PAGE, reports.length);
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  if (isLoading) {
    return (
      <section className="space-y-6">
        <TableSkeleton columns={7} rows={8} className="min-h-[520px]" />
      </section>
    );
  }

  return (
    <section className={PAGE_TABLE_SECTION_CLASS}>
      {errorMessage ? (
        <Alert
          variant="danger"
          title="Riwayat klasifikasi gagal dimuat"
          message={errorMessage}
          className="mb-4 shrink-0"
        />
      ) : null}

      <div
        className={[
          PAGE_TABLE_PANEL_CLASS,
          "rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
        ].join(" ")}
      >
        <div className="mb-4 shrink-0 border-b border-[#e7e8e9] pb-4">
          <h2 className="text-xl font-semibold leading-7 text-[#1a1a1a]">
            Seluruh Riwayat Klasifikasi
          </h2>
        </div>

        {reports.length ? (
          <>
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#e7e8e9]">
                    <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#52637f]">
                      Tanggal
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#52637f]">
                      Nama Penduduk
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#52637f]">
                      Hasil Klasifikasi
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#52637f]">
                      Pola Diet
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#52637f]">
                      Peringatan Dini
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#52637f]">
                      BMI
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-[#52637f]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm leading-5 text-[#1a1a1a]">
                  {paginatedReports.map((report, index) => {
                    const reportId = getReportId(report);

                    return (
                      <tr
                        key={reportId || `${currentPage}-${index}`}
                        className="border-b border-[#e7e8e9] transition-colors hover:bg-[#f3f4f5]/50"
                      >
                        <td className=" px-4 py-4">
                          {formatDateTime(report.created_at)}
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {report.resident_name || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <ClassificationBadge value={report.predicted_class} />
                        </td>
                        <td className="px-4 py-4 text-sm leading-5 text-[#52637f]">
                          {getDietPattern(report)}
                        </td>
                        <td className="px-2 py-4">
                          <EarlyWarningBadge value={report.early_warning} />
                        </td>
                        <td className="px-4 py-4">{formatNumber(report.bmi)}</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(ROUTES.reportDetail(reportId))}
                            className="rounded-full px-4 py-2 text-xs font-medium text-[#3a6936] transition hover:bg-[#3a6936]/10"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-[#e7e8e9] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm leading-5 flex justify-end text-[#52637f]">
                Menampilkan {visibleStart}-{visibleEnd} dari {reports.length} data
              </span>
              <div className="flex gap-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <EmptyState
              title="Belum ada riwayat klasifikasi"
              description="Riwayat akan muncul setelah penduduk selesai diklasifikasikan."
              className="border-[#c2c9bc] shadow-none"
            />
          </div>
        )}
      </div>
    </section>
  );
}
