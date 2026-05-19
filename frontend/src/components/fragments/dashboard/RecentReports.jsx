import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import StatusBadge from "../../elements/badges/StatusBadge";
import WarningBadge from "../../elements/badges/WarningBadge";
import EmptyState from "../../elements/tables/EmptyState";
import { ROUTES } from "../../../constants/routes";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return Number(value).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  });
}

function getResidentName(report) {
  return report.resident?.name || report.resident_name || report.name || "-";
}

function getInitial(name) {
  return name && name !== "-" ? name.charAt(0).toUpperCase() : "?";
}

function getBmi(report) {
  return report.bmi || report.resident?.bmi || report.classification?.bmi;
}

function getPredictedClass(report) {
  return report.predicted_class || report.classification?.predicted_class;
}

function getEarlyWarning(report) {
  return report.early_warning || report.classification?.early_warning;
}

export default function RecentReports({ reports = [] }) {
  const visibleReports = reports.slice(0, 4);

  return (
    <section className="overflow-hidden rounded-xl border border-[#edeeef] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between border-b border-[#e1e3e4] bg-[#f8f9fa]/60 p-6">
        <h2 className="text-xl font-semibold leading-7 text-[#1a1a1a]">
          Klasifikasi Terbaru
        </h2>
        <Link
          to={ROUTES.reports}
          className="text-xs font-medium tracking-wide text-[#3a6936] hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {visibleReports.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e1e3e4] bg-[#f8f9fa]/20">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#52637f]">
                  Nama Warga
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#52637f]">
                  BMI
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#52637f]">
                  Status Obesitas
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#52637f]">
                  Peringatan Dini
                </th>
              </tr>
            </thead>
            <tbody className="text-sm leading-5 text-[#1a1a1a]">
              {visibleReports.map((report, index) => {
                const name = getResidentName(report);
                const warning = getEarlyWarning(report);
                const isHighRisk = warning === "Risiko Tinggi";

                return (
                  <tr
                    key={report.id || report.classification_id || index}
                    className="border-b border-[#e1e3e4]/60 transition hover:bg-[#f8f9fa]/70"
                  >
                    <td className="flex items-center px-6 py-4">
                      <div
                        className={[
                          "mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                          isHighRisk
                            ? "bg-[#ffdad6] text-[#ba1a1a]"
                            : "bg-[#d4e8d5] text-[#3a6936]",
                        ].join(" ")}
                      >
                        {getInitial(name)}
                      </div>
                      {name}
                    </td>
                    <td
                      className={[
                        "px-6 py-4",
                        isHighRisk ? "font-semibold text-[#ba1a1a]" : "",
                      ].join(" ")}
                    >
                      {formatNumber(getBmi(report))}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={getPredictedClass(report)} />
                    </td>
                    <td className="px-6 py-4">
                      {warning ? (
                        <span
                          className={[
                            "inline-flex items-center gap-1",
                            isHighRisk ? "font-semibold text-[#ba1a1a]" : "",
                          ].join(" ")}
                        >
                          {isHighRisk ? (
                            <TriangleAlert aria-hidden="true" className="h-4 w-4" />
                          ) : null}
                          <WarningBadge warning={warning} />
                        </span>
                      ) : (
                        <span className="text-[#64748b]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState
            title="Belum ada klasifikasi terbaru"
            description="Data klasifikasi terbaru akan tampil setelah penduduk diklasifikasikan."
            className="min-h-40 border-[#e1e3e4] shadow-none"
          />
        </div>
      )}
    </section>
  );
}
